const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const { check, query, param } = require('express-validator');
const auth = require('../middleware/auth');

//Crear tarea
router.post('/',
    //auth//TODO: Implementarlo con modulo de usuarios,
    [
        check('titulo', 'El titulo es requerido.').not().isEmpty(),
        check('descripcion', 'Descripción requerida.').not().isEmpty(),
        check('fechaEntrega', 'Fecha requerida.').not().isEmpty()
    ],
    tareasController.createTarea
);

//Consultar todas tareas
router.get('/',
    //auth
    tareasController.consultarTareas
);

//Consultar tarea
router.get('/:id',
    //auth
    [
        param('id', 'Es necesario el id.').not().isEmpty(),
    ],
    tareasController.consultarTarea
);

//Modificar tarea
router.put('/:id',
    //auth
    [
        param('id', 'Es necesario el id.').not().isEmpty(),
        query('titulo', 'El titulo es requerido.').not().isEmpty(),
        query('descripcion', 'Descripción requerida.').not().isEmpty(),
        query('fechaEntrega', 'Fecha requerida.').not().isEmpty(),
        query('responsable', 'El id del responsable es requerido.').not().isEmpty(),
        query('estatus', 'El estatus es requerido.').not().isEmpty()
    ],
    tareasController.modificarTarea
);

//Eliminar tarea
router.delete('/:id',
    //auth
    [
        param('id', 'Es necesario el id.').not().isEmpty(),
    ],
    tareasController.eliminarTarea
);

module.exports = router;