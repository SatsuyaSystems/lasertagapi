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

router.post("/auth", urlencodedParser, async (req, res) => {
    Users.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.json({data: "NO USER"})
            }
            bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
            if (isMatch) {
                return res.json({user: user})
            } else {
                return res.json({data: "WRONG PW"})
            }
        })
    })
})
module.exports = router;
