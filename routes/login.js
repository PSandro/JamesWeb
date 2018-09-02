const express = require('express');
const app = require('../app');
const LoginToken = require('../session/LoginToken');
const router = express.Router();
const Session = require('../session/Session');
const User = require('../model/User');
const crypto = require('crypto');
const url = require('url');


router.get('/', function (req, res) {

    var parsedUrl = url.parse(req.originalUrl, true);
    var ip = req.connection.remoteAddress;

    var serverSideToken = LoginToken.getLoginToken(ip);

    if (serverSideToken === undefined) {
        serverSideToken = LoginToken.createLoginToken(ip);
    } else {
        serverSideToken.regenerate();
    }

    if (parsedUrl.query.error === undefined) {
        res.render('./../views/twig/login.twig', {error: false, message: 'No', logintoken: serverSideToken.loginKey});
    } else {

        var errorText;
        switch (parsedUrl.query.error) {
            case 'noUserMatch':
                errorText = 'Diese Benutzer-Passwort Kombination ist nicht bekannt.';
                break;
            case 'invalidToken':
                errorText = 'Ungültiger Logintoken!';
                break;
            case 'noToken':
                errorText = 'Kein Logintoken gefunden!';
                break;
        }


        res.render('./../views/twig/login.twig', {
            error: true,
            message: errorText,
            logintoken: serverSideToken.loginKey
        });
    }


});

router.post('/', function (req, res) {

    if (req.body.username !== undefined &&
        req.body.username !== "" &&
        req.body.password !== undefined &&
        req.body.password !== "" &&

        req.body.logintoken !== undefined &&
        req.body.logintoken !== "") {

        var ip = req.connection.remoteAddress;

        var username = req.body.username;
        var password = crypto.createHash('sha256').update(req.body.password).digest('hex');
        var loginKey = req.body.logintoken;
        var serverSideToken = LoginToken.getLoginToken(ip);


        if (serverSideToken !== undefined) {
            if (loginKey === serverSideToken.loginKey) {
                serverSideToken.addTry();
                User.findLoginMatch(username, password, function (user) {
                    if (user === undefined) {
                        res.redirect('/login?error=noUserMatch');
                    } else {
                        var session = Session.createSession(user);
                        res.cookie('session', session.token);
                        res.redirect('/dashboard');
                    }
                });


            } else {
                res.redirect('/login?error=invalidToken');
            }
        } else {
            res.redirect('/login?error=noToken');
        }


    }

    console.log("end");
});


module.exports = router;