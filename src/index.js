const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const {database,SQLServer} = require('./keys');
const bodyParser = require('body-parser');

// inicializaciones
const app = express();
require('./lib/passport');

// configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// middlewares
app.use(flash());
app.use(session({
    secret: 'iece',
    resave: false,
    saveUninitialized : false,
    store: new MySqlStore(database)
}));
app.use(morgan('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

// variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.msj = req.flash('msj');
    app.locals.user = req.user;
    next();
});

// rutas
// app.use(require('./routes'));
app.use(require('./routes/authentication'));
app.use('/pregunta', require('./routes/pregunta'));
app.use('/respuesta', require('./routes/respuesta'));
app.use('/respuestaTarea', require('./routes/respuestaTarea'));
app.use('/tarea', require('./routes/tarea'));
app.use('/proyecto', require('./routes/proyecto'));
app.use('/reunion', require('./routes/reunion'));
app.use('/distrito', require('./routes/distrito'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// iniciar el servidor
app.listen(app.get('port'), ()=>{
    console.log('server on port ', app.get('port'), 'http://localhost:4000');
});