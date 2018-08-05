const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) =>{
    res.send('It works');
});


app.listen(port, () =>{
    console.log(`server started on port ${port}`);
})