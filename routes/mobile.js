const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const bcrypt = require("bcryptjs")
const Users = require('../models/User');
const Classes = require('../models/Class')
const Weapons = require('../models/Weapon')
const Games = require('../models/Game')
const fs = require("fs");
const User = require('../models/User');

router.post("/auth", urlencodedParser, async (req, res) => {
    Users.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.json({data: "NO USER"})
            }
            bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
            if (isMatch) {
                var classes = []
                var weapons = []
                var games = []
                await Classes.find({user: user._id}, (err, data) => {classes = data})
                await Weapons.find({user: user._id}, (err, data) => {weapons = data})
                await Games.find({owner: user._id}, (err, data) => {games = data})
                return res.json({user: user, weapons: weapons, classes: classes, games: games})
            } else {
                return res.json({data: "WRONG PW"})
            }
        })
    })
})

router.post("/getweapons", urlencodedParser, async (req, res) => {
    await Weapons.find({user: req.body.userid}, function (err, weapons) {
        res.json({weapons: weapons})
    })
})

router.post("/getclasses", urlencodedParser, async (req, res) => {
    await Classes.find({user: req.body.userid}, function (err, classes) {
        res.json({classes: classes})
    })
})

router.post("/getgames", urlencodedParser, async (req, res) => {
    await Games.find({user: req.body.userid}, function (err, games) {
        res.json({games: games})
    })
})
module.exports = router;
