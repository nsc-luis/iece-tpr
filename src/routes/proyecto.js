const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const pool = require('../database');
// const { request } = require('express');

router.get('/', isLoggedIn, async(req,res)=>{
    const proyecto = await pool.query('SELECT * FROM proyecto');
    // console.log(proyecto);
    res.render('proyecto',{proyecto: proyecto[0]});
});

router.get('/edit/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params;
    if( req.user.admin == 0) {
        req.flash('msj', 'Error: Solo los usuarios administradores pueden editar esta sección.');
        return res.redirect('/proyecto');
    }
    const proyecto = await pool.query('SELECT * FROM proyecto');
    // console.log(proyecto);
    res.render('proyecto/edit',{proyecto: proyecto[0]});
});

router.post('/edit/:id', isLoggedIn, async(req,res)=>{
    const { nombre, descripcion } = req.body;
    const { id } = req.params;
    const newData = {
        nombre,
        descripcion
    };
    await pool.query('UPDATE proyecto SET ? WHERE id = ?', [newData, id]);
    res.redirect('/proyecto');
});

module.exports = router;