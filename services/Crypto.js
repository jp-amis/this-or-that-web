const CryptoJS = require('crypto-js');

const KEY = 'super-segredo';

function encrypt(text) {
    return CryptoJS.AES.encrypt(text, KEY).toString();
}

function decrypt(text) {
    const bytes = CryptoJS.AES.decrypt(text, KEY);
    if (bytes) {
        return bytes.toString(CryptoJS.enc.Utf8);
    }

    return false;
}

module.exports = {
    decrypt,
    encrypt,
};
