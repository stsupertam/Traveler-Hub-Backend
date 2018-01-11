const {
    queryWit,
    interactive,
    firstEntity,
  } = require('../../shared');
const FACEBOOK_ACCESS_TOKEN = require('../../config/chatbot');
const request = require('request');

function handleMessage(question, senderId) {
    answer = "";
    return queryWit(question).then(({entities}) => {
        const intent = firstEntity(entities, 'intent');
        const dateTime = firstEntity(entities, 'datetime') || {};
        if (!intent) {
            answer = "Try something else. I got no intent :("
            console.log('Try something else. I got no intent :(');
            return;
        }
        console.log(`${intent.value}`);
        switch (intent.value) {
            case 'appt_make':
                answer = "Okay, making an appointment"
                console.log('Okay, making an appointment', dateTime);
                break;
            case 'appt_show':
                answer = "Sure, showing your appointments"
                console.log('Sure, showing your appointments', dateTime);
                break;
            default:
                console.log(`${intent.value}`);
                break;
        }
        request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: FACEBOOK_ACCESS_TOKEN },
            method: 'POST',
            json: {
                recipient: { id: senderId },
                message: {
                    text:answer 
                }
            }
        });
    });
}

module.exports = {
    handleMessage
};