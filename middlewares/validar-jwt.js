const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res, next) => {

    const token = req.header('x-token');

    if(!token){
        return res.status(400).json({
            msg: 'No hay token en la petición'
        })
    }

    try {
        
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //leer el usuario que corresponde al uid
        const usuario = await Usuario.findById(uid);

        if(!usuario){
            return res.status(400).json({
                msg: 'Invalid token user doesnt exists'
            })
        }

        //verificar si el uid tiene un estado en true
        if(!usuario.estado){
            return  res.status(401).json({
                msg: 'Token no valido -es:f'
            })
        }

        req.usuario = usuario;

        next();

    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
    }


}

module.exports = {
    validarJWT
}