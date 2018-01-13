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
        onToSearch:   function(lifecycle, message, senderId) { return handleResponse.search(message, senderId)   },
        onToLatest:   function(lifecycle, message, senderId) { return handleResponse.latest(message, senderId)   },
        onToPopular:  function(lifecycle, message, senderId) { return handleResponse.popular(message, senderId)  },
        onToQuestion: function(lifecycle, message, senderId) { return handleResponse.question(message, senderId) },
        onToFinish:   function(lifecycle, message, senderId) { return handleResponse.finish(message, senderId)   },
    }
});

module.exports = (event) => {
    var senderId = event.sender.id;
    var message = event.message.text;

    if(message == 'state') {
        console.log(fsm.state);
    } else if(message === 'reset') {
        fsm.reset();
    } else if(fsm.state === 'greet') {
        fsm.toChoice(message, senderId);
    }
};