const handleResponse = require('./handleResponse');
const StateMachine = require('javascript-state-machine');

var fsm = new StateMachine({
    init: 'greet',
    transitions: [
        { name: 'reset',       from: '*',                  to: 'greet'    },
        { name: 'to_latest',   from: 'choice',             to: 'latest'   },
        { name: 'to_popular',  from: 'choice',             to: 'popular'  },
        { name: 'to_question', from: 'choice',             to: 'question' },
        { name: 'to_search',   from: ['choice', 'search'], to: 'search'   },
        { name: 'to_choice',   
          from: [ 'greet', 'search', 'latest', 'popular', 'question' ], 
          to: 'choice'   
        },
    ],
    methods: {
        onToChoice: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.choice(message, senderId, responseType);
        },
        onToSearch: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.search(message, senderId, responseType);
        },
        onToLatest: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.latest(message, senderId, responseType);
        },
        onToPopular: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.popular(message, senderId, responseType);
        },
        onToQuestion: function(lifecycle, message, senderId, responseType) { 
            return handleResponse.question(message, senderId, responseType);
        },
    }
});

module.exports = (event) => {
    var senderId = event.sender.id;
    var message = event.message.text;
    var state = fsm.state;

    if(message === 'reset') { fsm.reset(); }
    if(message === 'state') { console.log(state); }
    else {
        if(state === 'greet') { 
            fsm.toChoice(message, senderId, 'start'); 
        } else if(state === 'latest' || state === 'popular') {
            if(message === 'ค้นหาเพิ่มเติม') {
                fsm.toChoice(message, senderId, 'ls'); 
            } else {
                fsm.reset();
            }
        } else if(state === 'choice') {
            if(message === 'ค้นหาตามชื่อแพ็กเกจ') {
                fsm.toSearch(message, senderId, 'search')
            } else if(message === 'แพ็กเกจยอดนิยม') { 
                fsm.toPopular(message, senderId, 'popular')
            } else if(message === 'แพ็กเกจล่าสุด') { 
                fsm.toLatest(message, senderId, 'latest')
            } else if(message === 'แนะนำตามใจคุณ') { 
                fsm.toQuestion(message, senderId, 'question')
            }
        } 
            //if(message === 'ค้นหาเพิ่มเติม') {
            //    fsm.toSearch(message, senderId, 'search');
            //} else if(message === 'สอบถามอย่างอื่น') {
            //    fsm.toChoice(message, senderId, 'finish');
            //} else if(message === 'ไม่' || message === 'ขอบคุณ'){
            //    fsm.reset();
            //}
    }
};