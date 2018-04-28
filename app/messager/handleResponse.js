const request = require('request-promise-native')
const choice = require('./responses/choice')
const query = require('./responses/database')
const State = require('mongoose').model('State')
const Package = require('mongoose').model('Package')
const wordcut = require('wordcut')
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


exports.end = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    return request(facebook_request(choice.select('end'), senderId))
            .catch((err) => {console.log(err['error'])})
}

exports.search = async function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    let text = ''
    if(responseType === 'condition') {
        text = 'เพิ่มเงื่อนไข เช่น เที่ยวภาคเหนือ บริษัท Noomsaotours'
    } else {
        text = 'ลองพิมพ์มา เช่น ทะเล ภูเขา หรือ จะพิมพ์เป็นประโยค เช่น \
                อยากเที่ยวเชียงใหม่ ช่วงวันที่ 9 - 12 เดือนหน้า \
                งบ 5000 - 10000'
        try {
            await State.findOneAndUpdate({ userId: senderId }, { $set: { latestMessage: '' } })
        } catch(err) {
            console.log(err)
        }
    }
    return request(facebook_request({ text: text }, senderId))
            .catch((err) => {console.log(err['error'])});
}

exports.query = async function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    let state = {}
    try {
        state = await State.findOne({ userId: senderId }).lean()
        if(state.latestMessage !== '') {
            message = state.latestMessage + ' ' + message
        }
        await State.findOneAndUpdate({ userId: senderId }, { $set: { latestMessage: message } })
    } catch(err) {
        console.log(err)
    }
    return query.search(message)
            .then((message) => { 
                console.log(message) 
                return request(facebook_request(message, senderId)) 
            })
            .then(() => { return request(facebook_request(choice.select('search'), senderId)) })
            .catch((err) => {console.log(err['error'])})
}

exports.latest = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    return query.latest()
            .then((message) => { return request(facebook_request(message, senderId)) })
            .then(() => { return request(facebook_request(choice.select('more_question'), senderId)) })
            .catch((err) => {console.log(err['error'])})
}

exports.popular = function(message, senderId, responseType = 'None') {
    console.log(`ResponseType : ${responseType}`)
    console.log(`Message : ${message}`)
    console.log(`SenderID : ${senderId}`)
    return query.popular()
            .then((message) => { return request(facebook_request(message, senderId)) })
            .then(() => { return request(facebook_request(choice.select('more_question'), senderId)) })
            .catch((err) => {console.log(err['error'])})
}

exports.unknown = function(senderId, unknownType = 'None') {
    return request(facebook_request(choice.selectUnknown(unknownType), senderId))
            .catch((err) => {console.log(err['error'])})
}