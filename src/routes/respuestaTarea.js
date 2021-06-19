const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const pool = require('../database');
// const { request } = require('express');

router.get('/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params;
    const tarea = await pool.query('SELECT id,nombre,descripcion,fechayhora,status,(SELECT nombre FROM usuario WHERE id = idUsuarioSolicitante) solicitante,(SELECT nombre FROM usuario WHERE id = idUsuarioAsignado) asignado FROM tarea WHERE id = ?', [id]);
    const respuestas = await pool.query('SELECT r.id idRespuesta,respuesta,fechayhora,u.id idUsuario,u.nombre,u.foto FROM respuesta r JOIN usuario u ON u.id = r.usuario_id WHERE tipoRedaccion = "t" AND idPreguntaTarea = ?', [id]);
    res.render('respuestaTarea', {tarea: tarea[0], respuestas});
});

router.post('/add/:id', isLoggedIn, async(req,res)=>{

    const { id } = req.params;
    const involucrados = await pool.query('SELECT idUsuarioSolicitante, idUsuarioAsignado FROM tarea WHERE id = ?',[id]);

    if( involucrados[0].idUsuarioSolicitante != req.user.id && involucrados[0].idUsuarioAsignado != req.user.id ) {
        req.flash('msj', 'Error: Solo los usuarios involucarados en la tarea pueden agregar respuestas.');
        return res.redirect('/respuestaTarea/'+ id);
    }

    const data = {
        respuesta: req.body.respuesta,
        idPreguntaTarea: id,
        usuario_id: req.user.id,
        tipoRedaccion: 't'
    };
    
    await pool.query('INSERT INTO respuesta SET ?', [data]);
    res.redirect('/respuestaTarea/'+ id);
});

router.get('/delete/:id', isLoggedIn, async(req,res)=>{
    const { id } = req.params;
    const respuesta = await pool.query('SELECT * FROM respuesta WHERE id = ?',[id]);
    if( req.user.id != respuesta[0].usuario_id) {
        req.flash('msj', 'Error: Solo el autor de la respuesta puede borrarla.');
        return res.redirect('back');
    };
    await pool.query('DELETE FROM respuesta WHERE id = ?', [id]);
    res.redirect('back');
});

module.exports = router;