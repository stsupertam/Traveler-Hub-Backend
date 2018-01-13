const handleResponse = require('./handleResponse');
const StateMachine = require('javascript-state-machine');

var fsm = new StateMachine({
    init: 'greet',
    transitions: [
        { name: 'to_choice',   from: 'greet',                                                 to: 'choice'   },
        { name: 'to_search',   from: 'choice',                                                to: 'search'   },
        { name: 'to_latest',   from: 'choice',                                                to: 'latest'   },
        { name: 'to_popular',  from: 'choice',                                                to: 'popular'  },
        { name: 'to_question', from: 'choice',                                                to: 'question' },
        { name: 'to_finish',   from: [ 'choice', 'search', 'latest', 'popular', 'question' ], to: 'end'      },
        { name: 'reset',       from: [ 'choice', 'search', 'latest', 'popular', 'question' ], to: 'greet'    },
    ],
    methods: {
        onToChoice:   function(lifecycle, message, senderId) { return handleResponse.choice(message, senderId)   },
        onToSearch:   function(lifecycle, message, senderId) { return handleResponse.database(message, senderId) },
        onToLatest:   function(lifecycle, message, senderId) { return handleResponse.database(message, senderId) },
        onToPopular:  function(lifecycle, message, senderId) { return handleResponse.database(message, senderId) },
        onToQuestion: function(lifecycle, message, senderId) { return handleResponse.question(message, senderId) },
        onToFinish:   function(lifecycle, message, senderId) { return handleResponse.choice(message, senderId)   },
    }
});

module.exports = (event, payload) => {
    var senderId = event.sender.id;
    var message = event.message.text;
    var state = fsm.state;
    console.log(payload)


    if(message === 'reset') { fsm.reset(); }
    if(message === 'state') { console.log(state); }

    if(state === 'greet') { 
        fsm.toChoice(message, senderId, 'start'); 
    } else if(state === 'choice') {
        if(message === 'ค้นหาตามชื่อแพ็กเกจ') {
            fsm.toSearch(message, senderId, 'search')
        } else if(message === 'แพ็กเกจยอดนิยม') { 
            fsm.topopular(message, senderId, 'popular')
        } else if(message === 'แพ็กเกจล่าสุด') { 
            fsm.toLatest(message, senderId, 'latest')
        } else if(message === 'แนะนำตามใจคุณ') { 
            fsm.toQuestion(message, senderId, 'question')
        }
    }
};