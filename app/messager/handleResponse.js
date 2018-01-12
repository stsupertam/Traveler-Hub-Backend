const request = require('request-promise-native');
const {FACEBOOK_ACCESS_TOKEN} = require('../../config/chatbot');

exports.greet = function(message, senderId) {
    console.log(senderId);
    console.log(message);
    return request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: {
                text: 'test'
            }
        }
    }).catch((err) => {
        console.log(err['error']['error']);
    });
};