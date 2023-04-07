const express = require('express');
const router = express.Router();
const comentariosController = require('../controllers/comentariosController');

//Crear comentario
router.post('/',
    //auth
    comentariosController.crearComentario
);

module.exports = router;