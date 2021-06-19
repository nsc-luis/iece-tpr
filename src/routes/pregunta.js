const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');
const pool = require('../database');

const { smtpAuth } = require('../keys');
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport(smtpAuth);

router.get('/', isLoggedIn, async (req,res)=>{
    const preguntas = await pool.query('SELECT p.id idPregunta,pregunta,descripcion,fechayhora,status,u.id idUsuario,nombre FROM preguntas p JOIN usuario u ON u.id = p.usuario_id ORDER BY p.id DESC');
    // console.log(preguntas);
    res.render('pregunta', {preguntas});
});

router.get('/form', isLoggedIn, (req,res)=>{
    const pregunta = {
        pregunta: '',
        descripcion: '',
        usuario_id : req.user.id,
        action: 'add'
    }
    console.log(pregunta.action);
    res.render('pregunta/form', {pregunta});
});

router.post('/add', isLoggedIn, async (req,res)=>{
    const { pregunta, descripcion } = req.body;
    const preguntaNva = {
        pregunta,
        descripcion,
        usuario_id : req.user.id
    };

    let emails = await pool.query('SELECT email FROM usuario');
    let emailsJuntos = '';
    emails.forEach(email => {
        emailsJuntos += email.email + ';';
    });
    let mailOptions = {
        // should be replaced with real recipient's account
        to: emailsJuntos,
        subject: req.user.nombre + ' pregunta: ' + preguntaNva.pregunta,
        html: preguntaNva.descripcion
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('msj', error);
        }
        console.log('success', 'Message %s sent: %s', info.messageId, info.response);
    });

    await pool.query('INSERT INTO preguntas set ?', [preguntaNva]);
    req.flash('success', 'Pregunta guardada satisfactoriamente y enviada por correo.');
    res.redirect('/pregunta');
});

router.get('/edit/:id', isLoggedIn, async(req,res)=>{
    const { id } = req.params;
    const pregunta = await pool.query('SELECT * FROM preguntas WHERE id = ?', [id]);
    if( req.user.id != pregunta[0].usuario_id) {
        req.flash('msj', 'Error: Solo el autor de la pregunta puede editarla.');
        return res.redirect('/pregunta');
    };
    pregunta[0].action = 'edit/' + id;
    res.render('pregunta/form', {pregunta: pregunta[0]});
});

router.post('/edit/:id', isLoggedIn, async(req,res)=>{
    const { pregunta, descripcion } = req.body;
    const { id } = req.params;
    const newData = {
        pregunta,
        descripcion
    };
    await pool.query('UPDATE preguntas SET ? WHERE id = ?', [newData, id]);
    res.redirect('/pregunta');
});

router.get('/delete/:id', isLoggedIn, async(req,res)=>{
    const { id } = req.params;
    const pregunta = await pool.query('SELECT * FROM preguntas WHERE id = ?', [id]);
    if( req.user.id != pregunta[0].usuario_id) {
        req.flash('msj', 'Error: Solo el autor de la pregunta puede borrarla.');
        return res.redirect('/pregunta');
    };
    await pool.query('DELETE FROM preguntas WHERE id = ?', [id]);
    await pool.query('DELETE FROM respuesta WHERE tipoRedaccion = "p" AND idPreguntaTarea = ?',[id]);
    res.redirect('/pregunta');
});

module.exports = router;