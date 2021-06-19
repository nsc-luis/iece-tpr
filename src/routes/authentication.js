const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');
const pool = require('../database');

const multer  = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'src/public/images/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        let ext = file.originalname.split('.');
        if(ext[ext.length-1] !== 'png' && ext[ext.length-1] !== 'jpg' && ext[ext.length-1] !== 'bmp' && ext[ext.length-1] !== 'jpeg') {
            // return cb(new Error('Only images are allowed'));
            req.flash('msj','Error: El archivo seleccionado no es una imagen.');
            cb(null, false);
        } else {
            cb(null, true);
        }
    }
});

router.get('/', isNotLoggedIn, (req,res)=>{
    res.render('auth/signin');
});

router.get('/signup', isLoggedIn, (req,res)=>{
    if(req.user.admin == 0) {
        req.flash('msj','Error: Solo usuarios administradores pueden registrar usuarios.');
        res.redirect('/usuario');
    }
    res.render('auth/signup');
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/usuario',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/usuario',
        failureRedirect: '/',
        failureFlash: true
    })(req, res, next);
});

router.get('/cerrarSesion', isLoggedIn, (req,res) => {
    req.logOut();
    res.redirect('/');
});

router.get('/usuario', isLoggedIn, (req,res) => {
    res.render('auth/usuario');
});

router.post('/edit/:id', upload.single('foto'), isLoggedIn, async(req,res) => {

    const updateData = {};

    if(req.body.password == ''){
        req.flash('msj', 'Error: Debe ingresar una contraseña.');
        return res.redirect('/usuario');
    };
    if (req.body.password != req.body.confirmaPass){
        req.flash('msj', 'Error: Las contraseñas no coinciden.');
        return res.redirect('/usuario');
    };

    if(req.file){
        let ext = req.file.originalname.split('.');
        if(ext[ext.length-1] !== 'png' && ext[ext.length-1] !== 'jpg' && ext[ext.length-1] !== 'bmp' && ext[ext.length-1] !== 'jpeg') {
            // return cb(new Error('Only images are allowed'));
            updateData.foto = 'usr_logo_default.png';
        } else {
            updateData.foto = req.file.originalname;
        }
    }
    
    updateData.password = await helpers.encryptPassword(req.body.password);
    //console.log(req.body, req.file);
    
    await pool.query('UPDATE usuario SET ? WHERE id = ?',[updateData, req.user.id]);
    req.flash('success','La informacion se ha actualizado correctamente.');
    return res.redirect('/usuario');
});

module.exports = router;