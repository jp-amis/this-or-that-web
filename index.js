const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const async = require('async');

const app = express();
app.use(bodyParser.json({ limit: '25mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '25mb', extended: true }));

app.use('/uploads', express.static('uploads'));

// ##### Routes

// User Auth
app.post('/auth/login', require('./routes/Auth/Login'));
app.post('/auth/register', require('./routes/Auth/Register'));

const router = express.Router();

router.use(require('./services/ValidateToken'));
// Item
router.post('/item/new', require('./routes/Item/New'));

// This or That
router.post('/this-or-that', require('./routes/ThisOrThat/Get'));
// router.post('/this-or-that/vote', require('./routes/ThisOrThat/Vote'));

// Ranks
// router.get('/rank/top', require('./routes/Rank/Top'));
// router.get('/rank/worst', require('./routes/Rank/Worst'));
// router.get('/rank/', require('./routes/Rank/T'));

app.use(router);
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
            image TEXT NOT NULL,
            user_id INTEGER NOT NULL
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
