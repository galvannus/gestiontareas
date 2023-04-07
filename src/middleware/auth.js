const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function(req, res, next){

    //Leer token de header
    const token = req.header('x-auth-token');
    
    //Verificar si el token existe
    if( !token ){
        return res.status(401).json({ msg: "Don't have token, invalid action."})
    }

    //Valida el token
    try {
        const encrypted = jwt.verify(token, process.env.SECRET);
        req.user = encrypted.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'Invalid Token.' });
    }
}