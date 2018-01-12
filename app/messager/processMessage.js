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
    ],
    methods: {
        onToChoice:   function(message, senderId) { handleResponse.greet(message, senderId) },
        onToSearch:   function() { console.log('Search');   },
        onToLatest:   function() { console.log('Latest');   },
        onToPopular:  function() { console.log('Popular');  },
        onToQuestion: function() { console.log('Question'); },
        onToFinish:   function() { console.log('Finish');   }
    }
});

module.exports = (event) => {
    var senderId = event.sender.id;
    var message = event.message.text;
    console.log(senderId)

    if(message == 'state') {
        console.log(fsm.state);
    }
    else if(fsm.state === 'greet') {
        fsm.onToChoice(message, senderId);
    }
};