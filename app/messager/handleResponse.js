const request = require('request-promise-native')
const choice = require('./responses/choice')
const query = require('./responses/database')
const { FACEBOOK_ACCESS_TOKEN } = require('../../config/chatbot')

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
    return req
}

exports.choice = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    return request(facebook_request(choice.select(responseType), senderId))
            .catch((err) => {console.log(err['error'])})
}

exports.search = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    return request(facebook_request({text: 'ลองพิมพ์มา เช่น ทะเล'}, senderId))
            .catch((err) => {console.log(err['error'])})
//    return query.search(message)
//            .then((message) => { return request(facebook_request(message, senderId)) })
//            .catch((err) => {console.log(err['error'])})
}

exports.query = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    return query.search(message)
            .then((message) => { return request(facebook_request(message, senderId)) })
            .then(() => { return request(facebook_request(choice.select('search'), senderId)) })
            .catch((err) => {console.log(err['error'])})
}

exports.latest = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    return query.latest()
            .then((message) => { return request(facebook_request(message, senderId)) })
            .then(() => { return request(facebook_request(choice.select('end'), senderId)) })
            .catch((err) => {console.log(err['error'])})
}

exports.popular = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    return query.popular()
            .then((message) => { return request(facebook_request(message, senderId)) })
            .then(() => { return request(facebook_request(choice.select('end'), senderId)) })
            .catch((err) => {console.log(err['error'])})
}
//exports.question = function(message, senderId, responseType = 'None') {
//    console.log(`ResponseType : ${responseType}`)
//    console.log(`Message : ${message}`)
//    console.log(`SenderID : ${senderId}`)
//    return request(facebook_request('ลองถาม เช่น อยากไปเที่ยวที่ เชียงใหม่ ช่วงวันที่ 1 - 10 ม.ค.', senderId)).catch((err) => { console.log(err) })
//}
