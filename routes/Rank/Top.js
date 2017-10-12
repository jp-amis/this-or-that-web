const async = require('async');
const ThisOrThatService = require('./../../services/ThisOrThat');

function getRank(settings, callback) {
    ThisOrThatService.getTop500((err, cards) => {
        if (err) {
            return callback(err, settings);
        }

        settings.status = 200;
        settings.data = {
            ok: true,
            cards,
        };

        return callback(null, settings);
    });
}

function render(err, settings) {
    if (err && err !== 'CUSTOM_ERROR') {
        return settings.res.status(500).json({ error: 'Somethind went wrong :(' });
    }

    return settings.res.status(settings.status).json(settings.data);
}

function action(req, res) {
    const settings = {
        req,
        res,
        status: 500,
        data: {},
    };
    return async.waterfall([
        async.constant(settings),
        getRank,
    ], render);
}

module.exports = action;
