const { sequelize } = require('../db/models');
const { QueryTypes } = require('sequelize');
const { validationResult } = require('express-validator');

exports.createTarea = async (req, res) => {

    //Si el arreglo de errores no esta vacio responde con el error
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() })
    }

    //Obteniendo datos
    const { titulo, descripcion, fechaEntrega, responsable, tags } = req.query;
    
    const tareaConTags = {};

    try {
        
        const crearTarea = "INSERT INTO tareas (titulo,descripcion,fechaEntrega,responsable) VALUES ($titulo,$descripcion,STR_TO_DATE($fechaEntrega,'%d-%m-%Y'),$responsable)";

        //Llenando parametros de la query y ejecutando insert
        const [results, metadata] = await sequelize.query(crearTarea,{
            bind: {
                titulo,
                descripcion,
                fechaEntrega,
                responsable
            },
            type: QueryTypes.INSERT
        });

        //Si no contiene un id responde con mensaje de error y status 400
        if( !results ){
            res.status(400).json({ msg: 'Ha ocurrido un error. No se ha logrado crear la tarea.'})
        }

        const consultarTareaCreada = "SELECT * FROM tareas WHERE id = $id";

        //Llenando parametros de la query y ejecutando SELECT
        const tarea = await sequelize.query(consultarTareaCreada,{
            bind: {
                id: results
            },
            type: QueryTypes.SELECT
        });

        //Se ingresa objeto tarea a el objeto tareaConTags
        tareaConTags.tarea = tarea[0];

        /* TODO: En realidad esto se tendria
        que relacionar con un catalogo de tags con las tareas por medio de otra tabla.
        */

        //Si tags contiene elementos
        if(tags.length > 0){

            //Relaciona los tags con la tarea
            const crearTags = "INSERT INTO tags (tareaId, nombre) VALUES ($id,$nombre)";
            //Se recorre cada elemento del arreglo y se registra
            await tags.forEach( async tag => {
                const crearTag = await sequelize.query(crearTags,{
                    bind: {
                        id: results,
                        nombre: tag
                    },
                    type: QueryTypes.INSERT
                });
            });

            //Se consultan los tags relacionados a la tarea
            const tagsDeTareaCreada = "SELECT * FROM tags WHERE tareaId = $id";
            const tagsRelacionados = await sequelize.query(tagsDeTareaCreada,{
                bind: {
                    id: results
                },
                type: QueryTypes.SELECT
            });
            
            //Se ingresa objeto tags a el objeto tareaConTags
            tareaConTags.tags = tagsRelacionados;
        }

        //Respondiendo con status 200 y la tarea
        res.status(200).json(tareaConTags);

    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Ha ocurrido un error.' });
    }
}

exports.consultarTareas = async (_, res) => {

    try {
        const consultarTareas = "SELECT * FROM tareas";

        //Consultar todas la tareas
        const tareas = await sequelize.query(consultarTareas,{
            type: QueryTypes.SELECT
        });

        
        if( !tareas ){
            res.status(200).json({ msg: 'No se encontraron tareas.'});
        }

        //Responde con status 200 y las tareas encontradas
        res.status(200).json(tareas);
        
    } catch (error) {
        res.status(400).json({ msg: 'Ha ocurrido un error.' });
    }
}

exports.consultarTarea = async (req, res) => {

    const { id } = req.params;

    try {
        const datosCompletosTarea = {};

        //TODO: Enviar comentarios y tags relacionados la tarea
        const consultarTarea = "SELECT * FROM tareas WHERE id = $id";

        //Consultar tarea
        const tarea = await sequelize.query(consultarTarea,{
            bind: {
                id
            },
            type: QueryTypes.SELECT
        });

        //Responde con status 400 y mensaje de error si no existe la tarea
        if( !tarea ){
            res.status(400).json({ msg: 'No se encontró la tarea.' });
        }

        //Consultar comentarios relacionados a la tarea
        const consultarComentarios = "SELECT * FROM comentarios WHERE tareaId = $id";
        const comentarios = await sequelize.query(consultarComentarios,{
            bind: {
                id
            },
            type: QueryTypes.SELECT
        });

        //Se consultan los tags relacionados a la tarea
        const tagsDeTarea = "SELECT * FROM tags WHERE tareaId = $id";
        const tagsRelacionados = await sequelize.query(tagsDeTarea,{
            bind: {
                id
            },
            type: QueryTypes.SELECT
        });

        //Se llena el objeto datosCompletosTarea con los resultados de las querys
        datosCompletosTarea.tarea = tarea[0];

        if( comentarios ){
            datosCompletosTarea.comentarios = comentarios;
        }

        if( tagsRelacionados ){
            datosCompletosTarea.tags = tagsRelacionados;
        }

        //Responde con status 200 y toda la información relacionada a la tarea
        res.status(200).json(datosCompletosTarea);

    } catch (error) {
        res.status(400).json({ msg: 'Ha ocurrido un error.' });
    }
}

exports.modificarTarea = async (req, res) => {

    //Si el arreglo de errores no esta vacio responde con el error
    const errors = validationResult(req);
    if( !errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() })
    }

    const { id } = req.params;
    const { titulo, descripcion, fechaEntrega, estatus, responsable} = req.query;

    const replacements = {};

    try {
        replacements.id = id;
        if(titulo){ replacements.titulo = titulo;}
        if(descripcion){ replacements.descripcion = descripcion;}
        if(fechaEntrega){ replacements.fechaEntrega = fechaEntrega;}
        if(responsable){ replacements.responsable = responsable;}
        if(estatus){ replacements.estatus = estatus;}

        //Remplazando parametros de la query y ejecutando UPDATE de tareas
        const modificarTareaQuery = "UPDATE tareas SET titulo = :titulo, descripcion = :descripcion, fechaEntrega = :fechaEntrega, estatus = :estatus, responsable = :responsable WHERE id = :id";
        const [results, metadata] = await sequelize.query(modificarTareaQuery,{
            replacements,
            type: QueryTypes.UPDATE
        });

        //Se valida si se modifico por lo menos una fila
        if( metadata < 1){
            res.status(200).json({ msg: 'No se modifico ninguna fila.' });
        }

        res.status(200).json({ msg: 'Se modifico correctamente' });
        
    } catch (error) {
        res.status(400).json({ msg: 'Ha ocurrido un error.' });
    }
}


exports.eliminarTarea = async (req, res) => {
    
    const { id } = req.params;

    try {

        //Eliminar comentarios asociados
        const comentariosAsociados = "DELETE FROM comentarios WHERE tareaId = :id";
        await sequelize.query(comentariosAsociados,{
            replacements:{
                id
            },
            type: QueryTypes.DELETE
        });

        //Eliminar tags asociados
        const tagsAsociadas = "DELETE FROM tags WHERE tareaId = :id";
        await sequelize.query(tagsAsociadas,{
            replacements: {
                id
            },
            type: QueryTypes.DELETE
        });

        //Reemplazando parametros y ejecutando query
        const eliminarTareaQuery = "DELETE FROM tareas WHERE id = :id";
        await sequelize.query(eliminarTareaQuery,{
            replacements: {
                id
            },
            type: QueryTypes.DELETE
        });

        res.status(200).json({ msg: 'Se elimino la tarea correctamente.'});

    } catch (error) {
        res.status(400).json({ msg: 'Ha ocurrido un error.' });
    }

}