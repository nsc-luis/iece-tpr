const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const pool = require('../database');
// const { request } = require('express');

router.get('/:id', isLoggedIn, async (req,res)=>{
    const { id } = req.params;
    const pregunta = await pool.query('SELECT p.id idPregunta,pregunta,descripcion,fechayhora,status,u.id idUsuario,nombre FROM preguntas p JOIN usuario u ON u.id = p.usuario_id WHERE p.id = ?', [id]);
    const respuestas = await pool.query('SELECT r.id idRespuesta,respuesta,fechayhora,u.id idUsuario,u.nombre,u.foto FROM respuesta r JOIN usuario u ON u.id = r.usuario_id WHERE tipoRedaccion = "p" AND idPreguntaTarea = ?', [id]);
    res.render('respuesta', {pregunta: pregunta[0], respuestas});
});

router.post('/add/:id', isLoggedIn, async(req,res)=>{
    const { id } = req.params;
    const data = {
        respuesta: req.body.respuesta,
        idPreguntaTarea: id,
        usuario_id: req.user.id,
        tipoRedaccion: 'p'
    };

    await pool.query('INSERT INTO respuesta SET ?', [data]);
    res.redirect('/respuesta/'+ id);
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