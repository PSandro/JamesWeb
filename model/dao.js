const dao = require('mysql');
const connection = dao.createConnection({ //TODO read from config
    host: 'localhost',
    user: 'james',
    password: 'CMgpOkFF5Mxseace', //only for testing
    database: 'james'
});

connection.connect(function (err) {
    if (err) {
        console.error(err);
    }
});

module.exports = connection;