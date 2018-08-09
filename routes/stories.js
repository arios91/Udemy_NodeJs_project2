const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('stories/index');
});

//add stories form
router.get('/add', (req, res) => {
    res.render('stories/add');
});

module.exports = router;