module.exports = {
    "extends": "airbnb-base",
    "installedESLint": true,
    "plugins": [
        "import"
    ],
    "rules": {
        "indent": ["error", 4],
        "no-underscore-dangle": ["error", {"allow": []}],
        "no-param-reassign": 0,
    },
    "globals": {
        "db": true
    }
};
