const express = require('express');
const { Mongoose } = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser')
const { urlencoded } = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const passport = require('passport')
const bcrypt = require("bcryptjs")

const nodemailer = require("nodemailer")
var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'satsuyaos@gmail.com',
    pass: 'lsmstygplnifnffu'//'satsuyasbattleground4479'
  }
});

router.get('/login', async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('login')
})

router.post('/login', urlencodedParser, async(req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login'
    })(req, res, next)
})

router.get('/register', async(req, res) => {
    res.render('register')
})

router.post('/register', urlencodedParser, [
    check('username', 'The username must be 3+ chars long!')
        .exists()
        .isLength({ min: 3, max: 16 }),
    check('email', 'Email is not valid!')
        .isEmail()
        .isLength({ max: 50 })
], async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const alert = errors.array()
        res.render('register', {
            alert
        })
        return
    }
    else {
            if (await User.collection.findOne({email: req.body.email})) return res.redirect('/users/register')
            const regUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            })
            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(regUser.password, salt, async (err, hash) => {
                    //SET TO HASH
                    regUser.password = hash
                    regUser.save().then(async user => {
                        await transporter.sendMail({
                            from: '"Satsuyas Battleground" <satsuyaos@gmail.com>', // sender address
                            to: req.body.email, // list of receivers
                            subject: "Account Verification", // Subject line
                            html: "<p>Thanks for registering on Satsuyas Battleground<p><br>Click on this link to verify your Account!<br><a href='http://192.168.4.63:4479/users/verify/"+user._id+"'>https://satsuyas.de/users/verify/"+user._id+"</a>", // html body
                        });
                        
                    res.redirect('/users/login')
                })
            }))
    }
})

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/users/login')
})

router.get('/verify', (req, res) => {
    req.logout()
    res.render('verify')
})

router.get('/verify/:id', async(req, res) => {
    await User.findOneAndUpdate(
        {_id: req.params.id},
        {isverified: true}
    )
    res.redirect("/dashboard")
})

module.exports = router;