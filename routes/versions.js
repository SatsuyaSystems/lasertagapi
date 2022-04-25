const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const VersionCheck = require('../models/Versions')


router.get('/weapon', async(req, res) => {
    await VersionCheck.findOne({ program: "weapon" }, function(err, data) {
        res.json({ program: data.program, version: data.version })
    })
})

router.get('/vest', async(req, res) => {
    await VersionCheck.findOne({ program: "vest" }, function(err, data) {
        res.json({ program: data.program, version: data.version })
    })
})

module.exports = router;