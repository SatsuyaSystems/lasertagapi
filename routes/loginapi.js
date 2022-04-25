const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const passport = require('passport')

router.get('/login', async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('login')
})

router.post('/login', urlencodedParser, async(req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login'
    })(req, res, next)
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/users/login')
})


module.exports = router;