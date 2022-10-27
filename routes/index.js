const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')
const Users = require('../models/User');
const Classes = require('../models/Class')
const Weapons = require('../models/Weapon')
const Versions = require('../models/Versions')
const Groups = require('../models/Group')
const Games = require('../models/Game')
const fs = require("fs");

router.get('/', ensureAuthenticated, async(req, res) => {
    res.redirect('/dashboard')
})

router.get('/dashboard', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    if (req.user.isverified == false) return res.redirect("/users/verify")
    logs = fs.readFileSync("./assets/logs/gamefeed.txt", "utf-8").split('\n')
    res.render('index', {
        User: req.user,
        Logs: logs
    })
})

router.get('/cbuilder', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    if (req.user.isverified == false) return res.redirect("/users/verify")
    Classes.find({user: req.user._id}, function(err, classes) {
        res.render('cbuilder', {
            User: req.user,
            Classes: classes
        })
    })
})

router.get('/game', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    if (req.user.isverified == false) return res.redirect("/users/verify")
    Games.find({owner: req.user._id}, function(err, games) {
        res.render('game', {
            User: req.user,
            Games: games
        })
    })
})

router.get('/group', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    if (req.user.isverified == false) return res.redirect("/users/verify")
    Groups.findOne({owner: req.user._id}, function(err, group) {
        if(group) {
            Users.find({group: group.group}, function(err, users) {
                Games.find({owner: req.user._id}, function(err, games) {
                    res.render('group', {
                        User: req.user,
                        Group: group,
                        Users: users,
                        Games: games
                    }) 
                })
            })
        } else {
            res.render('group', {
                User: req.user,
                Group: group,
                Users: "users"
            })
        }
    })
})

router.get('/invite/:id', ensureAuthenticated, async(req, res) => {
    await Users.findOneAndUpdate(
        {_id: req.user._id},
        {group: req.params.id}
    )
    res.render('invite', {
        User: req.user
    })
})

router.get('/wbuilder', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    if (req.user.isverified == false) return res.redirect("/users/verify")
    Weapons.find({user: req.user._id}, function(err, weapons) {
        res.render('wbuilder', {
            User: req.user,
            Weapons: weapons
        })
    })
})

router.get('/player', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    if (req.user.isverified == false) return res.redirect("/users/verify")
    Classes.find({user: req.user._id}, function(err, classes) {
        Weapons.find({user: req.user._id}, function(err, weapons) {
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
    if (req.user.isverified == false) return res.redirect("/users/verify")
    res.render('terminal', {
        User: req.user
    })
})

router.get('/terminal/deleteuser/:id', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    await Users.findOneAndDelete({_id: req.params.id})
    await Classes.deleteMany({user: req.params.id})
    await Weapons.deleteMany({user: req.params.id})
    await Games.deleteMany({owner: req.params.id})
    await Groups.deleteMany({owner: req.params.id})
    res.redirect("/terminal")
})

router.get('/terminal/resetuser/:id', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    await Users.findOneAndUpdate(
        { _id: req.params.id },
        { class: "none", weapon: "none", group: "none" }
    )
    res.redirect("/terminal")
})


router.get('/devices', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    if (req.useragent.isMobile == true) return res.render('mobile')
    if (req.user.isverified == false) return res.redirect("/users/verify")
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

router.get('/devices/delvest/:file', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    var filePath = './downloads/vest/' + req.params.file; 
    fs.unlinkSync(filePath)
    time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    fs.appendFileSync('./assets/logs/terminal.txt', time + " | Deleted File in Vests: " + req.params.file + "\n")
    res.redirect("/devices")
})

router.get('/devices/delweapon/:file', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    var filePath = './downloads/weapon/' + req.params.file; 
    fs.unlinkSync(filePath);
    time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    fs.appendFileSync('./assets/logs/terminal.txt', time + " | Deleted File in Weapons: " + req.params.file + "\n")
    res.redirect("/devices")
})

router.get('/devices/weaponview/:file', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    var filePath = './downloads/weapon/' + req.params.file; 
    var text = fs.readFileSync(filePath, "utf-8").split('\n')
    res.render('viewer', {
        Text: text
    })
})

router.get('/devices/vestview/:file', ensureAuthenticated, async(req, res) => {
    if (req.user.terminal == false) return res.redirect("/403")
    var filePath = './downloads/vest/' + req.params.file; 
    var text = fs.readFileSync(filePath, "utf-8").split('\n')
    res.render('viewer', {
        Text: text
    })
})

module.exports = router;
