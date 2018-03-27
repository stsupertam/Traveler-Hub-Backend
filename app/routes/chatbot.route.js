module.exports = function(app) {
    let chatbot = require('../controllers/chatbot.controller')
    app.route('/chatbot')
        .get(chatbot.verification)
        .post(chatbot.messageHook)
}