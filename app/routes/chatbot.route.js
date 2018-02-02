module.exports = function(app) {
    var chatbot = require('../controllers/chatbot.controller');
    app.route('/chatbot')
        .get(chatbot.verification)
        .post(chatbot.messageHook);
};