const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const async = require('async');

const app = express();
app.use(bodyParser.json());

// ##### Routes

// User Auth
app.post('/auth/login', require('./routes/Auth/Login'));
app.post('/auth/register', require('./routes/Auth/Register'));

// Item
// app.post('/item/new', require('./routes/Item/New'));

// This or That
// app.get('/this-or-that', require('./routes/ThisOrThat/Get'));
// app.post('/this-or-that/vote', require('./routes/ThisOrThat/Vote'));

// Ranks
// app.get('/rank/top', require('./routes/Rank/Top'));
// app.get('/rank/worst', require('./routes/Rank/Worst'));
// app.get('/rank/', require('./routes/Rank/T'));

// var base64Data = req.rawBody.replace(/^data:image\/png;base64,/, "");
//
// require("fs").writeFile("out.png", base64Data, 'base64', function(err) {
//     console.log(err);
// });

// ##### Bootstrap
// Get sqlite database
function getSQLiteDatabase(callback) {
    const db = new sqlite3.Database('db.sqlite');
    return db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS user
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,   
            email TEXT NOT NULL,
            password TEXT NOT NULL
        );`);
        db.run(`CREATE TABLE IF NOT EXISTS item
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,   
            name TEXT NOT NULL,
            image TEXT NOT NULL
        );`);
        db.run(`CREATE TABLE IF NOT EXISTS thisorthat
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,   
            id_item_a INTEGER NOT NULL,
            id_item_b INTEGER NOT NULL,
            selected INTEGER NOT NULL,
            id_user INTEGER NOT NULL
        );`);

        global.db = db;
        return callback(null);
    });
}

// Initialize Express App
function initExpressApp(callback) {
    app.listen(3000, () => {
        callback(null);
    });
}

async.waterfall([
    getSQLiteDatabase,
    initExpressApp,
], (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Running...');
    return true;
});
