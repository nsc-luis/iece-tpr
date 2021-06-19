const express = require('express');
const router = express.Router();

router.get('/add', (req,res) => {
    res.send('hello world!');
});

module.exports = router;