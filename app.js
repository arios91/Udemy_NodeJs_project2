const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');


const app = express();
const port = process.env.PORT || 8080;

//bring in auth router
const auth = require('./routes/auth');

//passport config
require('./config/passport')(passport);

app.get('/', (req, res) =>{
    res.send('It works');
});

//use auth routes
app.use('/auth', auth);

app.listen(port, () =>{
    console.log(`server started on port ${port}`);
})