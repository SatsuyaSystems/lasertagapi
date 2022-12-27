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

//allows cross origin requests from anybody ([*]) the app needs this 
router.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});


router.post("/auth", urlencodedParser, async (req, res) => {
    Users.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.json({data: "NO USER"})
            }
            bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
            if (isMatch) {
                var classes = null
                var weapons = null
                var games = null
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
module.exports = router;
