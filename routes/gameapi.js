const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const { ensureAuthenticated } = require('../config/auth')
const Users = require('../models/User');
const Classes = require('../models/Class')
const Weapons = require('../models/Weapon')
const Game = require('../models/Game')
const fs = require("fs")

router.post("/death", urlencodedParser, async (req, res) => {
    time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    fs.appendFileSync('./assets/logs/gamefeed.txt', time + " | " + req.body.killer + " killed: " + req.body.player + "\n")
    res.json({status: "success"})
})

module.exports = router;