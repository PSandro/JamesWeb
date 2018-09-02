const crypto = require('crypto');
const HashMap = require('hashmap');
const sessions = new HashMap();

function Session(user) {
    this.user = user;
    this.token = this.generateSessionKey();
    sessions.set(this.token, this);
}


Session.prototype.generateSessionKey = function () {
    this.token = crypto.randomBytes(64).toString('hex');
    return this.token;
}

function createSession(user) {
    return new Session(user);
}

function getSession(token) {
    return sessions.get(token);
}

function renewSession(session) {
    if (session !== undefined) {
        var newToken = session.generateSessionKey();
        sessions.delete(session.token);
        sessions.set(newToken, session);
        return session;
    }
}

module.exports.createSession = createSession;
module.exports.getSession = getSession;
module.exports.renewSession = renewSession;