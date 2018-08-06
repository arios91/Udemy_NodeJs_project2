const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
//bring in auth router
const auth = require('./routes/auth');
//load user model
require('./models/User');
//passport config
require('./config/passport')(passport);


const app = express();
const port = process.env.PORT || 8080;

//cookieParser middleware
app.use(cookieParser());
//expressSession middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

//passport middleware, NEEDS TO BE AFTER expressSession middleware
app.use(passport.initialize());
app.use(passport.session());



//load keys
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


app.get('/', (req, res) =>{
    res.send('It works');
});

//Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});



//use auth routes
app.use('/auth', auth);

app.listen(port, () =>{
    console.log(`server started on port ${port}`);
})