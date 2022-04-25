const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth')

router.get('/', ensureAuthenticated, async(req, res) => {
    res.redirect('/dashboard')
})

router.get('/dashboard', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('index', {
        User: req.user
    })
})

router.get('/cbuilder', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('cbuilder', {
        User: req.user
    })
})

router.get('/game', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('index', {
        User: req.user
    })
})

router.get('/wbuilder', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('wbuilder', {
        User: req.user
    })
})

router.get('/player', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('index', {
        User: req.user
    })
})

router.get('/terminal', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('index', {
        User: req.user
    })
})

router.get('/devices', ensureAuthenticated, async(req, res) => {
    if (req.useragent.isMobile == true) return res.render('mobile')
    res.render('index', {
        User: req.user
    })
})

module.exports = router;
