const CryptoServices = require('./Crypto');

function checkUserExistsByEmail(email, callback) {
    db.get('SELECT id FROM user WHERE email = ?', [ email ], (err, row) => {
        if (err) {
            return callback(err, null);
        }

        if (row) {
            return callback(null, true);
        }

        return callback(null, false);
    });
}

function getByID(id, callback) {
    db.get('SELECT * FROM user WHERE id = ?',
        [id], (err, row) => {
            if (err) {
                return callback(err, null);
            }

            return callback(null, row);
        });
}

function findUserByEmailAndPassword(email, password, callback) {
    db.get('SELECT id FROM user WHERE email = ? AND password = ?',
        [email, password], (err, row) => {
            if (err) {
                return callback(err, null);
            }

            return callback(null, row);
        });
}

function save(user, callback) {
    db.run('INSERT INTO user (email, password) VALUES (?, ?)',
        [user.email, user.password],
        function (err) {
            if (err) {
                return callback(err, this);
            }

            return callback(null, this);
        });
}

function getTokenForID(id) {
    return CryptoServices.encrypt(id.toString());
}

function getIDForToken(token) {
    return CryptoServices.decrypt(token.toString());
}

module.exports = {};
module.exports.checkUserExistsByEmail = checkUserExistsByEmail;
module.exports.findUserByEmailAndPassword = findUserByEmailAndPassword;
module.exports.save = save;
module.exports.getByID = getByID;
module.exports.getTokenForID = getTokenForID;
module.exports.getIDForToken = getIDForToken;
