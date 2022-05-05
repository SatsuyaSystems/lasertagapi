const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const Users = require('../models/User');
const Classes = require('../models/Class')
const Weapons = require('../models/Weapon')
const Versions = require('../models/Versions')
const fs = require("fs")

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
    if (req.user.admin == false) return res.redirect("/403")
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
    if (req.user.terminal == false) return res.redirect("/403")
    if (req.useragent.isMobile == true) return res.render('mobile')
    Users.find({}, function(err, users) {
        Classes.find({}, function(err, classes) {
            Weapons.find({}, function(err, weapons) {
                res.render('terminal', {
                    User: req.user,
                    Weapons: weapons,
                    Classes: classes,
                    Users: users
                })
            })
        })
    })
})

router.get('/terminal/deleteuser/:id', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    await Users.findOneAndDelete({_id: req.params.id})
    res.redirect("/terminal")
})

router.get('/terminal/resetuser/:id', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    await Users.findOneAndUpdate(
        { _id: req.params.id },
        { class: "none", weapon: "none" }
    )
    res.redirect("/terminal#" + req.params.id)
})

router.get('/terminal/deleteclass/:id', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    await Classes.findOneAndDelete({_id: req.params.id})
    res.redirect("/terminal")
})

router.get('/terminal/deleteweapon/:id', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    await Weapons.findOneAndDelete({_id: req.params.id})
    res.redirect("/terminal")
})


router.get('/devices', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    if (req.useragent.isMobile == true) return res.render('mobile')
    Versions.findOne({program: "weapon"}, function(err, weapon) {
        Versions.findOne({program: "vest"}, function(err, vest) {
            var vfiles = fs.readdirSync('./downloads/vest/')
            var wfiles = fs.readdirSync('./downloads/weapon/')
            res.render('devices', {
                User: req.user,
                Weapon: weapon,
                Vest: vest,
                VestFiles: vfiles,
                WeaponFiles: wfiles
            })
        })
    })
})

module.exports = router;
