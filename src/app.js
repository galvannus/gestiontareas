const express = require('express');
const logger = require('morgan');
const cors = require('cors');

const app = express();

//Coonfiguración
app.use(logger('dev'));
app.use( cors() );
app.use( express.json({ extended: true}) );

//Rutas
app.use('/api/tareas', require('./routes/tarea'));
app.use('/api/comentarios', require('./routes/comentario'));

module.exports = app;