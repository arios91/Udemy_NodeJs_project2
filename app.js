const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');

//bring in routes
const auth = require('./routes/auth');
const index = require('./routes/index');

//load user model
require('./models/User');

//passport config
require('./config/passport')(passport);


const app = express();
const port = process.env.PORT || 8080;

//handlebars middleware,
//set default layout and point it to main.handlebars in views/layouts/main folder
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
//set view engine
app.set('view engine', 'handlebars');

//cookieParser middleware
app.use(cookieParser());

//expressSession middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

//passport middleware, NEEDS TO BE AFTER expressSession middleware
app.use(passport.initialize());
app.use(passport.session());

//load keys from config file
const keys = require('./config/keys');

//connect to mongoose, pass in database as param
//since it responds with a promise, you have to use .then after
//if you want to catch errors, use .catch
mongoose.connect(keys.mongoURI, {
    useNewUrlParser: true
})
.then(() =>{
    console.log('MongoDB Connected');
})
.catch(err => console.log(err));

//Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//use routes brought in at top
app.use('/auth', auth);
app.use('/', index);

app.listen(port, () =>{
    console.log(`server started on port ${port}`);
})