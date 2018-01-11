const request = require('request');
const StateMachine = require('javascript-state-machine');
const {FACEBOOK_ACCESS_TOKEN} = require('../../config/chatbot');

var fsm = new StateMachine({
    init: 'solid',
    transitions: [
        { name: 'melt',     from: 'solid',  to: 'liquid' },
        { name: 'freeze',   from: 'liquid', to: 'solid'  },
        { name: 'vaporize', from: 'liquid', to: 'gas'    },
        { name: 'condense', from: 'gas',    to: 'liquid' }
    ],
    methods: {
        onMelt:     function() { console.log('I melted')    },
        onFreeze:   function() { console.log('I froze')     },
        onVaporize: function() { console.log('I vaporized') },
        onCondense: function() { console.log('I condensed') }
    }
});

module.exports = (event) => {
    var senderId = event.sender.id;
    var message = event.message.text;

    if(message === 'state') {
        console.log(fsm.state);
    } else if(message === 'melt' && fsm.state === 'solid') {
        fsm.melt();
    } else if(message === 'freeze' && fsm.state === 'liquid') {
        fsm.freeze();
    } else if(message === 'vaporize' && fsm.state === 'liquid') {
        fsm.vaporize();
    } else if(message === 'condense' && fsm.state === 'gas') {
        fsm.condense();
    }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                text: message
            }
        }
    });
};