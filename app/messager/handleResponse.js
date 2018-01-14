const request = require('request-promise-native');
const choice = require('./responses/choice');
const query = require('./responses/database');
const {FACEBOOK_ACCESS_TOKEN} = require('../../config/chatbot');

function facebook_request(message, senderId) {
    req = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: senderId },
            message: message
        }
    }
    return req;
}

exports.choice = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`);
    console.log(`Message : ${message}`);
    console.log(`SenderID : ${senderId}`);
    return request(facebook_request(choice.select(responseType), senderId))
            .catch((err) => {console.log(err['error'])});
};

exports.database = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`);
    console.log(`Message : ${message}`);
    console.log(`SenderID : ${senderId}`);
    var message = {
        text: responseType 
    }

    return request(facebook_request(message, senderId))
            .catch((err) => {console.log(err['error'])});
};

//exports.question = function(message, senderId, responseType = 'None') {
//    console.log(`ResponseType : ${responseType}`);
//    console.log(`Message : ${message}`);
//    console.log(`SenderID : ${senderId}`);
//    return request(facebook_request('ลองถาม เช่น อยากไปเที่ยวที่ เชียงใหม่ ช่วงวันที่ 1 - 10 ม.ค.', senderId)).catch((err) => { console.log(err) });
//};
