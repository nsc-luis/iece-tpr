const passport = require('passport');
const pool = require('../database');
const helpers = require('../lib/helpers');
const LocalStrategy = require('passport-local').Strategy;

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    
    const rows = await pool.query('SELECT * FROM usuario WHERE email = ?',[email]);
    if (rows.length > 0){
        const user = rows[0];
        user.admin = rows[0].admin;
        const validPassword = await helpers.matchPassword(password,user.password);
        if (validPassword){
            done(null, user, req.flash('success', 'Bienvenido ' + user.nombre));
        } else {
            done(null, false, req.flash('msj', 'Error. Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('msj', 'Error. El usuarios no existe.'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const {nombre} = req.body;
    const newUser = {
        nombre,
        email,
        password,
        proyecto_id: '1'
    }
    newUser.password = await helpers.encryptPassword(password);

    const validaMail = await pool.query('SELECT * FROM usuario WHERE email = ?',[newUser.email]);
    if(validaMail.length > 0){
        if (validaMail[0].email == newUser.email) {
            return done(null, false, req.flash('msj','Error: El correo electronico ingresado ya ha sido registrado.'));
        }
    }

    const result = await pool.query('INSERT INTO usuario SET ?',[newUser]);
    // console.log(result);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const row = await pool.query('SELECT * FROM usuario WHERE id = ?',[id]);
    done(null, row[0]);
});