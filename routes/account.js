const express = require('express');
const Session = require('./../session/Session');
const router = express.Router();


router.get('/', function (req, res) {
    if (req.cookies.session !== undefined &&
        req.cookies.session !== "") {

        var key = req.cookies.session;
        var session = Session.getSession(key);

        if (session !== undefined) {
            res.render('./../views/twig/account.twig', {user: session.user});
        } else res.redirect('/login');
    } else res.redirect('/login');
});

module.exports = router;