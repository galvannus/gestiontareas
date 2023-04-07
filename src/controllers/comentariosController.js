const { sequelize } = require('../db/models');
const { QueryTypes } = require('sequelize');

exports.crearComentario = async (req, res) => {
    //TODO: Validar errores

    const { tareaId, body } = req.query;

    try {
        const crearComentario = "INSERT INTO comentarios (tareaId, body) VALUES ($tareaId,$body)";

        //Llenando parametros de la query y ejecutando insert
        const [results, metadata] = await sequelize.query(crearComentario,{
            bind: {
                tareaId,
                body
            },
            type: QueryTypes.INSERT
        });

        //Validar si no retorna un id responde con mensaje de error y status 400
        if( !results ){
            res.status(400).json({ msg: 'Ha ocurrido un error. No se ha logrado crear el comentario.' });
        }

        const consultarComentario = "SELECT * FROM comentarios WHERE id = $id";

        //Llenando parametros de la query y ejecutando select
        const comentarioCreado = await sequelize.query(consultarComentario,{
            bind: {
                id: results
            },
            type: QueryTypes.SELECT
        });

        //Respondiendo con status 200 y el comentario
        res.status(200).json(comentarioCreado);
        
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'Ha ocurrido un error.' });
    }
}