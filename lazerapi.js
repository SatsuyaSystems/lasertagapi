console.log('Loading...')
const port = 4479
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
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

//PASSPORT
app.use(passport.initialize())
app.use(passport.session())

//CONNECT FLASH
app.use(flash())

//ROUTES
app.get('/filter', function(req, res){
    if (req.useragent.isCurl == true) return res.send("NO CURLS")
    res.send(req.useragent);
});
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/loginapi'));
app.use('/version', require("./routes/versions"));
app.use('/gapi', require("./routes/gameapi"));
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
app.set('views', './views')
app.set('view engine', 'ejs')

//DB CONNECT
mongoose.connect(
    "mongodb+srv://root:VuXOeMHiDl9MXfJU@os.mwmkg.mongodb.net/lasertag?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },
    () => console.log('MongoDB connectet!')
);

//PORT
app.listen(port);
console.log('API Online!')

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    mongoose.connection.close()
    process.exit();
});
