console.log('Loading...')
const port = 25567
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
require('dotenv/config');
var useragent = require('./useragent');
var fileupload = require('express-fileupload')
const app = express();

app.use(bodyParser.json());
app.use(useragent.express());
app.use(fileupload())

//ASSETS
app.use('/assets', express.static(__dirname + '/assets'))
app.use('/downloads', express.static(__dirname + '/downloads'))

//SESSION
app.use(session({
    secret: [process.env.SESSIONSECRET,process.env.SESSIONSECRET_1, process.env.SESSIONSECRET_2],
    resave: true,
    name: 'satsuyaos',
    cookie: {
        maxAge: 86400 * 1000
    },
    saveUninitialized: true
}))

//PASSPORT
app.use(passport.initialize())
app.use(passport.session())

//CONNECT FLASH
app.use(flash())


app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

//ROUTES
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/loginapi'));
app.use('/version', require("./routes/versions"));
app.use('/gapi', require("./routes/gameapi"));
app.use('/exe', require("./routes/controller"));
app.use('/mobile', require("./routes/mobile"));
app.use('/api', require("./routes/api-endpoint"));
app.get('/403', async(req, res) => {
    res.render('403')
})
app.get('*', async(req, res) => {
    res.render('404')
})
app.post('*', async(req, res) => {
    res.render('404')
})


//TEMPLATING ENGINE
app.set('views', ['./views/desktop', './views/mobile'])
app.set('view engine', 'ejs')

//DB CONNECT
const url = 'mongodb://zero:nepGtQeAlYfSwbw8EoqR@work.miraidyus.world:27017/satsuya?mechanism=SCRAM-SHA-256&authSource=admin'
mongoose.set('strictQuery', false);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }).then(console.log("Mongo loaded"))

//PORT
app.listen(port);
console.log('API Online!')
console.log("hello world")

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    mongoose.connection.close()
    process.exit();
});