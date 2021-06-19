const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

router.get('/', (req,res) =>{
    res.render('distrito');
});

router.get('/form', (req,res) =>{
    res.render('distrito/form');
});

module.exports = router;