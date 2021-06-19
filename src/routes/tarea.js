const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

const { smtpAuth } = require('../keys');
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport(smtpAuth);

router.get('/', isLoggedIn, async(req,res)=>{
    const tareas = await pool.query('SELECT id idTarea, nombre, descripcion, fechayhora, status, idUsuarioSolicitante, idUsuarioAsignado, (SELECT nombre FROM usuario WHERE id = idUsuarioSolicitante) nombreSolicitante, (SELECT nombre FROM usuario WHERE id = idUsuarioAsignado) nombreAsignado FROM tarea ORDER BY idTarea DESC');
    res.render('tarea',{tareas});
});

router.get('/form', isLoggedIn, async(req,res)=>{
    const tarea = {
        nombre: '',
        descripcion: '',
        idUsuarioSolicitante : req.user.id,
        action: 'add'
    }
    const usuarios = await pool.query('SELECT id, nombre FROM usuario');
    // console.log(tarea.action);
    res.render('tarea/form', {tarea, usuarios});
});

router.post('/add', isLoggedIn, async (req,res)=>{
    const { nombre, descripcion, idUsuarioAsignado } = req.body;
    const tareaNva = {
        nombre,
        descripcion,
        idUsuarioSolicitante : req.user.id,
        idUsuarioAsignado
    };

    let email = await pool.query('SELECT email FROM usuario WHERE id = ?',[idUsuarioAsignado]);
    let mailOptions = {
        // should be replaced with real recipient's account
        to: email[0].email,
        subject: req.user.nombre + ' te asigna la tarea: ' + tareaNva.nombre,
        html: tareaNva.descripcion
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('msj', error);
        }
        console.log('success', 'Message %s sent: %s', info.messageId, info.response);
    });

    // console.log(req.body);
    await pool.query('INSERT INTO tarea SET ?', [tareaNva]);
    res.redirect('/tarea');
});

router.get('/edit/:id', isLoggedIn, async(req,res)=>{
    const { id } = req.params;
    const tarea = await pool.query('SELECT * FROM tarea WHERE id = ?', [id]);
    tarea[0].action = 'edit/' + id;
    const usuarios = await pool.query('SELECT id, nombre FROM usuario');
    res.render('tarea/form', {tarea: tarea[0],usuarios});
});

router.get('/delete/:id', isLoggedIn, async(req,res)=>{
    const { id } = req.params;
    const tarea = await pool.query('SELECT * FROM tarea WHERE id = ?', [id]);
    if( req.user.id != tarea[0].idUsuarioSolicitante) {
        req.flash('msj', 'Error: Solo el autor de la tarea puede borrarla.');
        return res.redirect('/tarea');
    };
    await pool.query('DELETE FROM respuesta WHERE tipoRedaccion = "t" AND idPreguntaTarea = ?',[id]);
    await pool.query('DELETE FROM tarea WHERE id = ?', [id]);
    res.redirect('/tarea');
});

module.exports = router;