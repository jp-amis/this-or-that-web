const async = require('async');
const fs = require('fs');
const slug = require('slug');
const uuid = require('uuid/v4');
const ItemService = require('./../../services/Item');

function processParams(settings, callback) {
    if (!settings.req.body.name) {
        settings.status = 400;
        settings.data = {
            error: 'Name is mandatory',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    if (!settings.req.body.image) {
        settings.status = 400;
        settings.data = {
            error: 'Image is mandatory',
        };
        return callback('CUSTOM_ERROR', settings);
    }

    return callback(null, settings);
}

function saveImage(settings, callback) {
    settings.fileName = `${slug(settings.req.body.name)}-${uuid()}.png`;
    fs.writeFile(`uploads/${settings.fileName}`, settings.req.body.image, 'base64',
        err => callback(err, settings));
}

function saveItem(settings, callback) {
    ItemService.save({
        name: settings.req.body.name,
        image: settings.fileName,
        user_id: settings.req.locals.user.id,
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
        saveImage,
        saveItem,
    ], render);
}

module.exports = action;
