const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

//load models
require('./models/User');
require('./models/Story');

//bring in routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');

//load keys from config file
const keys = require('./config/keys');

//bring in handlebars helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
} = require('./helpers/hbs');

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

//passport config
require('./config/passport')(passport);


const app = express();
const port = process.env.PORT || 8080;

// bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//method override middleware
app.use(methodOverride('_method'));

//handlebars middleware,
//set default layout and point it to main.handlebars in views/layouts/main folder
app.engine('handlebars', exphbs({
    helpers: {
        truncate: truncate,
        stripTags: stripTags,
        formatDate: formatDate,
        select: select,
        editIcon: editIcon
    },
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

//Global variables
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//set static folder
app.use(express.static(path.join(__dirname, 'public')));

//use routes brought in at top
app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);

app.listen(port, () =>{
    console.log(`server started on port ${port}`);
})