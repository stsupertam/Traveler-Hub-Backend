const request = require('request-promise-native');
const {FACEBOOK_ACCESS_TOKEN} = require('../../config/chatbot');

function facebook_request(message, senderId) {
    req = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                text: message 
            }
        }
    }
    return req;
}

exports.greet = function(message, senderId) {
    console.log(`Message : ${message}`);
    console.log(`SenderID : ${senderId}`);
    return request(facebook_request('greet', senderId)).catch((err) => { console.log(err) });
};

exports.choice = function(message, senderId) {
    console.log(`Message : ${message}`);
    console.log(`SenderID : ${senderId}`);
    return request(facebook_request('choice', senderId)).catch((err) => { console.log(err) });
};