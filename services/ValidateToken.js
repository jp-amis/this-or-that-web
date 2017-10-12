const async = require('async');
const UserServices = require('./User');

function validateToken(settings, callback) {
    if (!settings.req.headers['x-token']) {
        settings.status = 403;
        settings.data = {
            error: 'Forbidden',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    try {
        const id = UserServices.getIDForToken(settings.req.headers['x-token']);
        return UserServices.getByID(id, (err, user) => {
            if (err) {
                settings.status = 403;
                settings.data = {
                    error: 'Forbidden',
                };
                return callback('CUSTOM_ERROR', settings);
            }

            settings.req.locals = {
                user,
            };

            return callback(null, settings);
        });
    } catch (error) {
        console.log(error);
        settings.status = 403;
        settings.data = {
            error: 'Forbidden',
        };
        return callback('CUSTOM_ERROR', settings);
    }
}

function finish(err, settings) {
    if (err) {
        if (err !== 'CUSTOM_ERROR') {
            return settings.res.status(500).json({error: 'Somethind went wrong :('});
        }

        return settings.res.status(settings.status).json(settings.data);
    }

    return settings.next();
}

function action(req, res, next) {
    const settings = {
        req,
        res,
        next,
        status: 500,
        data: {},
    };
    return async.waterfall([
        async.constant(settings),
        validateToken,
    ], finish);
}

module.exports = action;
