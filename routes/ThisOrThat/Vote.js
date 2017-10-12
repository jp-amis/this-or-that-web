const async = require('async');
const ThisOrThatService = require('./../../services/ThisOrThat');

function processParams(settings, callback) {
    if (!settings.req.body.thisCard) {
        settings.status = 400;
        settings.data = {
            error: 'This card missing',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    if (!settings.req.body.thatCard) {
        settings.status = 400;
        settings.data = {
            error: 'That card missing',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    if (!settings.req.body.vote) {
        settings.status = 400;
        settings.data = {
            error: 'Vote missing',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    if (settings.req.body.vote !== settings.req.body.thisCard
    && settings.req.body.vote !== settings.req.body.thatCard) {
        settings.status = 400;
        settings.data = {
            error: 'Invalid vote',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    return callback(null, settings);
}

function computeVote(settings, callback) {
    ThisOrThatService.vote({
        id_item_a: settings.req.body.thisCard,
        id_item_b: settings.req.body.thatCard,
        selected: settings.req.body.vote,
        id_user: settings.req.locals.user.id,
    }, (err) => {
        if (err) {
            return callback(err, settings);
        }

        settings.status = 200;
        settings.data = {
            ok: true,
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
        processParams,
        computeVote,
    ], render);
}

module.exports = action;
