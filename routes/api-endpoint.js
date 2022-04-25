const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const User = require('../models/User')
const Game = require('../models/Game')
const Class = require('../models/Class')
const Weapon = require('../models/Weapon')

  router.get('/', (req, res) => {
    res.render('403')
  })

  router.post('/createuser', urlencodedParser, (req, res) => {
    const regUser = new User({
      username: req.body.username,
      password: req.body.password
    })
    regUser.save()
    res.send("done!")
  })

  router.post('/creategame', urlencodedParser, (req, res) => {
    const newGame = new Game({
      time: req.body.time,
      regeneration: req.body.regeneration,
      regrate: req.body.regrate,
      lives: req.body.lives,
      teams: req.body.teams,
      friendlyfire: req.body.friendlyfire,
      unitabilities: req.body.unitabilities,
      killstreak: req.body.killstreak,
      infammo: req.body.infammo,
      shield: req.body.shield,
      items: req.body.items
    })
    newGame.save()
    res.send("done!")
  })

  router.post('/createclass', urlencodedParser, async(req, res) => {
    if (await Class.findOne({classname: req.body.classname })) {
      await Class.findOneAndDelete({ classname: req.body.classname, user: req.user.username})
    }
    newClass = new Class({
      classname: req.body.classname,
      shield: req.body.shield,
      health: req.body.health,
      luck: req.body.luck,
      armor: req.body.armor,
      knockofftime: req.body.knockofftime,
      regrate: req.body.regrate,
      user: req.user.username
    })
    newClass.save()
    res.redirect("/cbuilder")
  })

  router.post('/deleteclass', urlencodedParser, async(req, res) => {
    await Class.findOneAndDelete({ classname: req.body.classname, user: req.body.username })
    res.json({data: "yeet"})
  })

  router.post('/createweapon', urlencodedParser, async(req, res) => {
    if (await Weapon.findOne({weaponname: req.body.weaponname })) {
      await Weapon.findOneAndDelete({ weaponname: req.body.weaponname, user: req.user.username})
    }
    newWeapon = new Weapon({
      weaponname: req.body.weaponname,
      damage: req.body.damage,
      reload: req.body.reload,
      magazine: req.body.magazine,
      magreload: req.body.magreload,
      user: req.user.username
    })
    newWeapon.save()
    res.redirect("/wbuilder")
  })

  router.post('/deleteweapon', urlencodedParser, async(req, res) => {
    await Weapon.findOneAndDelete({ weaponname: req.body.weaponname, user: req.body.username })
    res.json({data: "yeet"})
  })
  
  router.post('/fetchuser', urlencodedParser, async(req, res) => {
    res.json({
      class: "Klasse",
      weapon: "Waffe"
    })
  })

  router.get('/gamesettings', urlencodedParser, async(req, res) => {
    res.json({
      time: 15,
      regeneration: true,
      health: true,
      lives: 3,
      teams: true,
      friendlyfire: true,
      unitabilities: true,
      killstreak: true,
      infammo: true,
      shield: true,
      items: true
    })
  })

  router.post('/weaponperks', urlencodedParser, async(req, res) => {
    await Weapon.findOne({ weaponname: req.body.weaponname, user: req.body.username })
      .then(weapons => {
        if (!weapons) {
          return res.json({data: "Cant find weapon"})
        }
        res.json({
          weaponname: weapons.weaponname,
          damage: weapons.damage,
          reload: weapons.reload,
          magazine: weapons.magazine,
          magreload: weapons.magreload
        })
    })
  })

  router.post('/classperks', urlencodedParser, async(req, res) => {
    await Class.findOne({ classname: req.body.classname, user: req.body.username })
      .then(classes => {
        if (!classes) {
          return res.json({data: "Cant find class"})
        }
        res.json({
          classname: classes.classname,
          shield: classes.shield,
          health: classes.health,
          luck: classes.luck,
          armor: classes.armor,
          knockofftime: classes.knockofftime,
          regrate: classes.regrate
        })
    })
  })

module.exports = router;