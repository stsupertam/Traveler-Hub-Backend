const Package = require('mongoose').model('Package');
const processMessage = require('../messager/processMessage');

exports.verification = function(req, res, next) {
    const hubChallenge = req.query['hub.challenge'];
    const hubMode = req.query['hub.mode'];
    const verifyTokenMatches = (req.query['hub.verify_token'] === 'gundam');
    if (hubMode && verifyTokenMatches) {
        res.status(200).send(hubChallenge);
    } else {
        res.status(403).end();
    }
};

exports.messageHook = function(req, res, next) {
    if (req.body.object === 'page') {
        req.body.entry.forEach(entry => {
            entry.messaging.forEach((event) => {
                if (event.message && event.message.text) {
                    processMessage(event);
                }
            });
        });
        res.status(200).end();
    }
};
