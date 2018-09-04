const crypto = require('crypto');
const bindings = new Map();

class LoginToken {

    constructor(ip) {
        this.remainingTrys = 5;
        this.ip = ip;
        this.loginKey = this.generateNewKey();

    }

    generateNewKey() {
        return crypto.randomBytes(64).toString('hex');
    }

    regenerate() {
        this.loginKey = this.generateNewKey();
        return this;
    }

    addTry() {
        this.remainingTrys--;
    }

    hasTrysLeft() {
        return this.remainingTrys > 0;
    }

}

function getLoginToken(ip) {
    return bindings.get(ip);
}

function createLoginToken(ip) {
    var token = new LoginToken(ip);
    bindings.set(ip, token);
    return token;
}

module.exports.getLoginToken = getLoginToken;
module.exports.createLoginToken = createLoginToken;



