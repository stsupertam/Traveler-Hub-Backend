const handleResponse = require('./handleResponse')
const StateMachine = require('javascript-state-machine')
const visualize = require('javascript-state-machine/lib/visualize');
const State = require('mongoose').model('State')

let fsm = new StateMachine({
    init: 'greet',
    transitions: [
        { name: 'reset',           from: '*',                            to: 'greet'     },
        { name: 'to_latest',       from: ['choice', 'unknown'],          to: 'latest'    },
        { name: 'to_popular',      from: ['choice', 'unknown'],          to: 'popular'   },
        { name: 'to_search',       from: ['choice', 'query'],            to: 'search'    },
        { name: 'to_query',        from: ['search', 'query'],            to: 'query'     },
        { name: 'to_end',          from: ['latest', 'popular', 'query'], to: 'end'       },
        { name: 'goto',            from: '*',                            to: function(s) { return s }},
        { 
            name: 'to_choice',   
            from: [ 'greet', 'search', 'query', 'latest', 'popular', 'unknown' ], 
            to: 'choice'   
        }
    ],
    methods: {
        onToChoice: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.choice(message, senderId, responseType)
        },
        onToSearch: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.search(message, senderId, responseType)
        },
        onToQuery: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.query(message, senderId, responseType)
        },
        onToLatest: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.latest(message, senderId, responseType)
        },
        onToPopular: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.popular(message, senderId, responseType)
        },
        onToEnd: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.end(message, senderId, responseType)
        }
    }
})

async function updateUserState(userId, state) {
    try {
        await State.findOneAndUpdate({ userId: userId }, { $set: { state: state } })
    } catch(err) {
        console.log(err)
    }
}

async function getUserState(userId) {
    try {
        let state = await State.findOne({ userId: userId })
        let currentState = ''
        if(state) {
            currentState = state.state
            if(state.state === 'end') currentState = 'greet'
        } else {
            currentState = 'greet'
            let data = {
                userId: userId,
                state: 'greet',
            }
            State.create(data)
        }
        return currentState
    } catch(err) {
        console.log(err)
    }
}

module.exports = async function(event) {
    let senderId = event.sender.id
    let message = event.message.text
    let state = await getUserState(senderId)
    fsm.goto(state)

    console.log(`Current State: ${state}`)

    try {
        if(message === 'reset') { 
            fsm.goto('greet') 
        }
        else {
            if(state === 'greet') { 
                fsm.toChoice(message, senderId, 'start') 
            } else if(state === 'latest' || state === 'popular') {
                if(message === 'ค้นหาในรูปแบบอื่น') {
                    fsm.toChoice(message, senderId, 'other') 
                } else if(message === 'หยุดการค้นหา') {
                    fsm.toEnd(message, senderId, 'end')
                } else {
                    handleResponse.unknown(senderId, 'latestAndPopular')
                }
            } else if(state === 'choice') {
                if(message === 'ค้นหาตามใจคุณ') {
                    fsm.toSearch(message, senderId, 'search')
                } else if(message === 'แพ็กเกจยอดนิยม') { 
                    fsm.toPopular(message, senderId, 'popular')
                } else if(message === 'แพ็กเกจล่าสุด') { 
                    fsm.toLatest(message, senderId, 'latest')
                } else {
                    handleResponse.unknown(senderId, 'choice')
                }
            } else if(state === 'search') {
                fsm.toQuery(message, senderId, 'search')
            } else if(state === 'query') {
                if(message === 'หยุดการค้นหา') {
                    fsm.toEnd(message, senderId, 'end')
                } else if(message === 'ค้นหาในรูปแบบอื่น') {
                    fsm.toChoice(message, senderId, 'other')
                } else if(message === 'เพิ่มเงื่อนไข') {
                    fsm.toSearch(message, senderId, 'condition')
                } else if(message === 'เริ่มค้นหาใหม่') {
                    fsm.toSearch(message, senderId, 'new')
                } else {
                    handleResponse.unknown(senderId, 'search')
                }
            }
        }
        updateUserState(senderId, fsm.state)
    } catch(err) {
        console.log(err)
    }
}

