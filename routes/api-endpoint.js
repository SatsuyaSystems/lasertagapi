const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const fs = require("fs")
const User = require('../models/User')
const Game = require('../models/Game')
const Class = require('../models/Class')
const Weapon = require('../models/Weapon')
const Version = require('../models/Versions')
const Group = require('../models/Group')
const bcrypt = require("bcryptjs")

  router.get('/', (req, res) => {
    res.render('403')
  })

  router.post('/createuser', urlencodedParser, (req, res) => {
    time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    fs.appendFileSync('./assets/logs/terminal.txt', time + " | Created User: " + req.body.username + " E-Mail: " + req.body.email + "\n")
    const regUser = new User({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      isverified: true
    })

    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(regUser.password, salt, (err, hash) => {
          //SET TO HASH
          regUser.password = hash
          regUser.save().then(user => {
            res.redirect('/terminal')
          })
    }))
  })

  router.post('/changeuserpw', urlencodedParser, (req, res) => {
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(req.body.password, salt, async (err, hash) => {
          await User.findOneAndUpdate(
            {_id: req.body.userid},
            {password: hash}
          )
          res.redirect("/users/logout")
    }))
  })

  router.post('/creategame', urlencodedParser, async (req, res) => {
    if (await Game.findOne({name: req.body.gamename, owner: req.user._id })) {
      await Game.findOneAndDelete({ name: req.body.gamename, owner: req.user._id})
    }
    const newGame = new Game({
      name: req.body.gamename,
      owner: req.user._id,
      regeneration: req.body.regeneration,
      regrate: req.body.regrate,
      lives: req.body.lives,
      teams: req.body.teams,
      teamsize: req.body.teamsize,
      friendlyfire: req.body.friendlyfire,
      unitabilities: req.body.unitabilities,
      killstreak: req.body.killstreak,
      infammo: req.body.infammo,
      shield: req.body.shield,
      items: req.body.items
    })
    newGame.save()
    res.redirect("/game")
  })

  router.post('/deletegame', urlencodedParser, async(req, res) => {
    await Game.findOneAndDelete({ name: req.body.gamename, owner: req.user._id })
    res.json({data: "yeet"})
  })

  router.post('/createclass', urlencodedParser, async(req, res) => {
    if (await Class.findOne({classname: req.body.classname, user: req.user._id })) {
      await Class.findOneAndDelete({ classname: req.body.classname, user: req.user._id})
    }
    newClass = new Class({
      classname: req.body.classname,
      shield: req.body.shield,
      health: req.body.health,
      luck: req.body.luck,
      armor: req.body.armor,
      knockofftime: req.body.knockofftime,
      regrate: req.body.regrate,
      user: req.user._id
    })
    newClass.save()
    res.redirect("/cbuilder")
  })

  router.post('/deleteclass', urlencodedParser, async(req, res) => {
    await Class.findOneAndDelete({ classname: req.body.classname, user: req.body.userid })
    res.json({data: "yeet"})
  })

  router.post('/changeclass', urlencodedParser, async(req, res) => {
    await User.findOneAndUpdate(
      { _id: req.body.userid },
      { class: req.body.class }
    )
    res.redirect("/player")
  })

  router.post('/createweapon', urlencodedParser, async(req, res) => {
    if (await Weapon.findOne({weaponname: req.body.weaponname, user: req.user._id })) {
      await Weapon.findOneAndDelete({ weaponname: req.body.weaponname, user: req.user._id})
    }
    newWeapon = new Weapon({
      weaponname: req.body.weaponname,
      damage: req.body.damage,
      reload: req.body.reload,
      magazine: req.body.magazine,
      magreload: req.body.magreload,
      user: req.user._id,
      critrate: req.body.critrate
    })
    newWeapon.save()
    res.redirect("/wbuilder")
  })

  router.post('/deleteweapon', urlencodedParser, async(req, res) => {
    await Weapon.findOneAndDelete({ weaponname: req.body.weaponname, user: req.body.userid })
    res.json({data: "yeet"})
  })

  router.post('/changeweapon', urlencodedParser, async(req, res) => {
    await User.findOneAndUpdate(
      { _id: req.body.userid },
      { weapon: req.body.weapon }
    )
    res.redirect("/player")
  })
  
  router.post('/fetchuser', urlencodedParser, async(req, res) => {
    await User.findOne({username: req.body.username, group: req.body.group}).then(user => {
      if (!user) {
        return res.json({data: "Cant find user"})
      }
      res.json({
        userid: user._id,
        class: user.class,
        weapon: user.weapon
      })
    })
  })

  router.post('/groupplayers', urlencodedParser, async(req, res) => {
    await User.find({group: req.body.group}, function(err, users) {
      res.json(users)
    })
  })

  router.post('/usergame', urlencodedParser, async(req, res) => {
    await Game.findOne({owner: req.body.userid, name: req.body.name})
    .then(game => {
      if (!game) {
        return res.json({data: "Cant find game"})
      }
      res.json({
        name: game.name,
        regeneration: game.regeneration,
        regrate: game.regrate,
        lives: game.lives,
        teams: game.teams,
        teamsize: game.teamsize,
        friendlyfire: game.friendlyfire,
        unitabilities: game.unitabilities,
        killstreak: game.killstreak,
        infammo: game.infammo,
        shield: game.shield,
        items: game.items
      })
    })
  })

  router.post('/weaponperks', urlencodedParser, async(req, res) => {
    await Weapon.findOne({ weaponname: req.body.weaponname, user: req.body.userid })
      .then(weapons => {
        if (!weapons) {
          return res.json({data: "Cant find weapon"})
        }
        res.json({
          weaponname: weapons.weaponname,
          damage: weapons.damage,
          reload: weapons.reload,
          magazine: weapons.magazine,
          magreload: weapons.magreload,
          critrate: weapons.critrate
        })
    })
  })

  router.post('/classperks', urlencodedParser, async(req, res) => {
    await Class.findOne({ classname: req.body.classname, user: req.body.userid })
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


router.post('/weaponvc', urlencodedParser, async(req, res) => {
  await Version.findOneAndUpdate(
    { program: "weapon" },
    { version: req.body.version }
  )
  time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  fs.appendFileSync('./assets/logs/terminal.txt', time + " | Changed Weapon-Version to: " + req.body.version + "\n")
  res.redirect("/devices")
})

router.post('/vestvc', urlencodedParser, async(req, res) => {
  await Version.findOneAndUpdate(
    { program: "vest" },
    { version: req.body.version }
  )
  time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  fs.appendFileSync('./assets/logs/terminal.txt', time + " | Changed Vest-Version to: " + req.body.version + "\n")
  res.redirect("/devices")
})

router.post('/uploadvest', urlencodedParser, async(req, res) => {
  if (req.files) {
    var file = req.files.file
    var filename = file.name
    file.mv('./downloads/vest/' + filename)
    time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    fs.appendFileSync('./assets/logs/terminal.txt', time + " | Added file: " + filename + " to Vests\n")
  }
  res.redirect("/devices")
})

router.post('/uploadweapon', urlencodedParser, async(req, res) => {
  if (req.files) {
    var file = req.files.file
    var filename = file.name
    file.mv('./downloads/weapon/' + filename)
    time = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    fs.appendFileSync('./assets/logs/terminal.txt', time + " | Added file: " + filename + " to Weapons\n")
  }
  res.redirect("/devices")
})

router.post('/joingroup', urlencodedParser, async(req, res) => {
  await User.findOneAndUpdate(
    {_id: req.user._id},
    {group: req.body.group}
  )
  res.redirect("/player")
})

router.post('/creategroup', urlencodedParser, async(req, res) => {
  Group.findOne({owner: req.body.owner}, async function(err, group) {
    if (group) return res.json({data: "You allready have a group!"})
    var id = Math.floor(100000 + Math.random() * 900000)
    const newGroup = new Group({
      group: id,
      name: req.body.name,
      owner: req.body.owner
    })
    newGroup.save()
    await User.findOneAndUpdate(
      {_id: req.user._id},
      {group: id}
    )
    res.redirect("/group")
  })
})

router.post('/deletegroup', urlencodedParser, async(req, res) => {
  await Group.findOneAndDelete({ _id: req.body.group })
  res.json({data: "yeet"})
})

router.post('/groupgame', urlencodedParser, async(req, res) => {
  await Group.findOneAndUpdate(
    {_id: req.body.group},
    {game: req.body.game}
  )
  res.redirect("/group")
})

module.exports = router;