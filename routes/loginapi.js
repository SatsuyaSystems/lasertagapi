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
const fs = require("fs")
var transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: 'satsuyaos@gmail.com',
    pass: 'yjetmrvndqxzfeub'
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
                        fs.readFile("./config/emails/verify_email.html", "utf8", async (err, data) => {
                            if (err) return console.log(err)
                            const emailData = data.replace("{USERNAME}", req.body.username)
                            const emailData2 = emailData.replace("{BTNLINK}", "http://127.0.0.1:4479/users/verify/"+user._id)
                            await transporter.sendMail({
                                from: '"Satsuyas Battleground" <satsuyaos@gmail.com>', // sender address
                                to: req.body.email, // list of receivers
                                subject: "Account Verification", // Subject line
                                html: emailData2, // html body
                            });
                        })
                        
                    res.redirect('/users/login')
                })
            }))
    }
})

router.get('/logout', (req, res) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/users/login');
      });
});

router.get('/verify', (req, res) => {
    if(req.user.isverified == true) return res.redirect("/dashboard")
    res.render('verify')
})

router.get('/verify/:id', async(req, res) => {
    await User.findOneAndUpdate(
        {_id: req.params.id},
        {isverified: true}
    )
    res.redirect("/dashboard")
})

router.post('/resetpassword', urlencodedParser, async (req, res) => {
    await User.findOne({email: req.body.indent}, async (err, user) => {
        if(user){
            var randomstring = Math.random().toString(36).slice(-8);
            bcrypt.genSalt(10, (err, salt) =>
                bcrypt.hash(randomstring, salt, async (err, hash) => {
                    await User.findOneAndUpdate(
                        {email: user.email},
                        {password: hash}
                    )
                })
            )
            fs.readFile("./config/emails/password_email.html", "utf8", async (err, data) => {
                emailData = data.replace("{USERNAME}", user.username)
                emailData2 = emailData.replace("{NEWPW}", randomstring)
                await transporter.sendMail({
                    from: '"Satsuyas Battleground" <satsuyaos@gmail.com>', // sender address
                    to: user.email, // list of receivers
                    subject: "Password reset!", // Subject line
                    html: emailData2, // html body
                });
            })
        }
        res.redirect("/users/login")
    })
})

module.exports = router;