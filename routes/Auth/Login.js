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

    return callback(null, settings);
}

function checkUser(settings, callback) {
    UserServices.findUserByEmailAndPassword(
        settings.req.body.email, settings.req.body.password, (err, user) => {
            if (err) {
                return callback(err, settings);
            }

            if (!user) {
                settings.status = 400;
                settings.data = {
                    error: 'E-mail or Password invalid',
                };
                return callback('CUSTOM_ERROR', settings);
            }

            settings.status = 200;
            settings.data = {
                ok: true,
                token: UserServices.getTokenForID(user.id),
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
        checkUser,
    ], render);
}

module.exports = action;
