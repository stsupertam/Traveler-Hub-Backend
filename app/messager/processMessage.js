const handleResponse = require('./handleResponse')
const StateMachine = require('javascript-state-machine')

let fsm = new StateMachine({
    init: 'greet',
    transitions: [
        { name: 'reset',       from: '*',                   to: 'greet'    },
        { name: 'to_latest',   from: 'choice',              to: 'latest'   },
        { name: 'to_popular',  from: 'choice',              to: 'popular'  },
        { name: 'to_unknown',  from: ['choice', 'unknown'], to: 'unknown' },
        { name: 'to_search',   from: ['choice', 'query'],   to: 'search'   },
        { name: 'to_query',    from: ['search', 'query'],   to: 'query'    },
        { name: 'to_choice',   
          from: [ 'greet', 'search', 'query', 'latest', 'popular', 'unknown' ], 
          to: 'choice'   
        },
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
        onToUnknown: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.unknown(message, senderId, responseType)
        },
    }
})

module.exports = (event) => {
    let senderId = event.sender.id
    let message = event.message.text
    let state = fsm.state

    if(message === 'reset') { fsm.reset() }
    if(message === 'state') { console.log(state) }
    else {
        if(state === 'greet') { 
            fsm.toChoice(message, senderId, 'start') 
        } else if(state === 'latest' || state === 'popular') {
            if(message === 'ค้นหาเพิ่มเติม') {
                fsm.toChoice(message, senderId, 'ls') 
            } else {
                fsm.reset()
            }
        } else if(state === 'choice') {
            if(message === 'ค้นหาตามใจคุณ') {
                fsm.toSearch(message, senderId, 'search')
            } else if(message === 'แพ็กเกจยอดนิยม') { 
                fsm.toPopular(message, senderId, 'popular')
            } else if(message === 'แพ็กเกจล่าสุด') { 
                fsm.toLatest(message, senderId, 'latest')
            } else if(message === 'แนะนำตามใจคุณ') { 
                fsm.toQuestion(message, senderId, 'question')
            } else {
                fsm.toUnknown(message, senderId, 'unknown')
            }
        } else if(state === 'search') {
            fsm.toQuery(message, senderId, 'search')
        } else if(state === 'query') {
            if(message === 'หยุดการค้นหา') {
                fsm.reset()
            } else if(message === 'สอบถามอย่างอื่น') {
                fsm.toChoice(message, senderId, 'ls')
            } else if(message === 'ค้นหาเพิ่มเติม') {
                console.log('wtf')
                fsm.toQuery(message, senderId, 'search')
            } else {
                fsm.toUnknown(message, senderId, 'unknown')
            }
        } else if(state === 'unknown') {
            if(message === 'ค้นหาตามใจคุณ') {
                fsm.toSearch(message, senderId, 'search')
            } else if(message === 'แพ็กเกจยอดนิยม') { 
                fsm.toPopular(message, senderId, 'popular')
            } else if(message === 'แพ็กเกจล่าสุด') { 
                fsm.toLatest(message, senderId, 'latest')
            } else if(message === 'แนะนำตามใจคุณ') { 
                fsm.toQuestion(message, senderId, 'question')
            } else {
                fsm.toUnknown(message, senderId, 'unknown')
            }
        }
    }
}