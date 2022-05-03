const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const Users = require('../models/User');
const Classes = require('../models/Class')
const Weapons = require('../models/Weapon')

router.get('/', ensureAuthenticated, async(req, res) => {
    res.redirect('/dashboard')
})

router.get('/dashboard', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('index', {
        User: req.user
    })
})

router.get('/cbuilder', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('cbuilder', {
        User: req.user
    })
})

router.get('/game', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('index', {
        User: req.user
    })
})

router.get('/wbuilder', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('wbuilder', {
        User: req.user
    })
})

router.get('/player', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    Classes.find({user: req.user.username}, function(err, classes) {
        Weapons.find({user: req.user.username}, function(err, weapons) {
            res.render('playersettings', {
                User: req.user,
                Weapons: weapons,
                Classes: classes
            })
        })
    })
})

router.get('/terminal', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    Users.find({}, function(err, users) {
        res.render('terminal', {
            User: req.user,
            Users: users
        })
    })
})

router.get('/terminal/deleteuser/:id', ensureAuthenticated, async(req, res) => {
    await Users.findOneAndDelete({_id: req.params.id})
    res.redirect("/terminal")
})

router.get('/terminal/resetuser/:id', ensureAuthenticated, async(req, res) => {
    await Users.findOneAndUpdate(
        { _id: req.params.id },
        { class: "none", weapon: "none" }
    )
    res.redirect("/terminal#" + req.params.id)
})

router.get('/devices', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('index', {
        User: req.user
    })
})

module.exports = router;
