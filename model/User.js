const mysql = require('./dao');

class User {

    constructor(id, username, email, password, rankId) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.rankId = rankId;
    }

}

function fetchUser(username, callback) {
    mysql.query('SELECT * FROM james_user WHERE username=?', [username], function (error, rows, fields) {
        if (error) throw error;

        if (rows.length >= 1) {
            var result = rows[0];
            return callback(new User(result.user_id, result.username, result.email, result.passwd, result.rank_id));
        } else {
            return callback(undefined);
        }
    });
}

function findLoginMatch(username, password, callback) {
    mysql.query('SELECT * FROM james_user WHERE username=? AND passwd=?', [username, password], function (error, rows, fields) {
        if (error) throw error;

        if (rows.length >= 1) {
            var result = rows[0];
            callback(new User(result.user_id, result.username, result.email, result.passwd, result.rank_id));
        } else {
            callback(undefined);
        }
    });
}

module.exports.fetchUser = fetchUser;
module.exports.findLoginMatch = findLoginMatch;





