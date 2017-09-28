const validator = require('validator');
const async = require('async');
const UserServices = require('./../../services/User');

function processParams(settings, callback) {
    if (!settings.req.body.email) {
        settings.status = 400;
        settings.data = {
            error: 'E-mail is mandatory',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    if (!settings.req.body.password) {
        settings.status = 400;
        settings.data = {
            error: 'Password is mandatory',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    if (!validator.isEmail(settings.req.body.email)) {
        settings.status = 400;
        settings.data = {
            error: 'E-mail is not valid',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    if (settings.req.body.password.length < 4) {
        settings.status = 400;
        settings.data = {
            error: 'Password must have at least 4 characters',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    return callback(null, settings);
}

function checkUserExists(settings, callback) {
    UserServices.checkUserExistsByEmail(settings.req.body.email, (err, exists) => {
        if (err) {
            return callback(err, settings);
        }

        if (exists) {
            settings.status = 400;
            settings.data = {
                error: 'User already exists',
            };
            return callback('CUSTOM_ERROR', settings);
        }

        return callback(null, settings);
    });
}

function saveUser(settings, callback) {
    UserServices.save(settings.req.body, (err, data) => {
        if (err) {
            return callback(err, settings);
        }

        settings.status = 200;
        settings.data = {
            ok: true,
            token: UserServices.getTokenForID(data.lastID),
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
        checkUserExists,
        saveUser,
    ], render);
}

module.exports = action;
