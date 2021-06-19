const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const pool = require('../database');
// const { request } = require('express');

router.get('/', isLoggedIn, async (req,res)=>{
    const reuniones = await pool.query('SELECT * FROM reuniones ORDER BY id DESC');
    res.render('reunion', {reuniones});
});

router.get('/form', isLoggedIn, (req,res)=>{
    if( req.user.admin == 0) {
        req.flash('msj', 'Error: Solo los usuarios administradores pueden editar esta sección.');
        return res.redirect('/reunion');
    };
    const reunion = {
        fecha: '',
        puntosATratar: '',
        acuerdos: '',
        tareasNacientes: '',
        action: 'add'
    };
    res.render('reunion/form',{reunion});
});

router.post('/add', isLoggedIn, async(req,res)=>{
    const {puntosATratar,acuerdos,tareasNacientes} = req.body;
    let fecha = req.body.fecha.split("/");
    let proximaReunion = req.body.proximaReunion.split("/");
    let fechaFormateada = fecha[2] + "-" + fecha[1] + "-" + fecha[0];
    let proximaReunionFormateada = proximaReunion[2] + "-" + proximaReunion[1] + "-" + proximaReunion[0];
    const reunionNva = {
        fecha: fechaFormateada,
        puntosATratar,
        acuerdos,
        tareasNacientes,
        proximaReunion: proximaReunionFormateada
    };
    await pool.query('INSERT INTO reuniones SET ?', [reunionNva]);
    res.redirect('/reunion');
});

router.get('/form/:id', isLoggedIn, async(req,res)=>{
    if( req.user.admin == 0) {
        req.flash('msj', 'Error: Solo los usuarios administradores pueden editar esta sección.');
        return res.redirect('/reunion');
    };
    const {id} = req.params;
    const reunion = await pool.query('SELECT * FROM reuniones WHERE id = ?',[id]);
    reunion[0].action = 'edit/' + id;
    res.render('reunion/form',{reunion: reunion[0]});
});

router.post('/edit/:id', isLoggedIn, async(req,res)=>{
    const {id} = req.params;
    const {puntosATratar,acuerdos,tareasNacientes} = req.body;
    const upData = {
        puntosATratar,
        acuerdos,
        tareasNacientes
    };
    await pool.query('UPDATE reuniones SET ? WHERE id = ?',[upData,id]);
    res.redirect('/reunion');
});

router.get('/delete/:id', isLoggedIn, async(req,res)=>{
    if( req.user.admin == 0) {
        req.flash('msj', 'Error: Solo los usuarios administradores pueden editar esta sección.');
        return res.redirect('/reunion');
    };
    const {id} = req.params;
    await pool.query('DELETE FROM reuniones WHERE id = ?',[id]);
    res.redirect('/reunion');
});

module.exports = router;