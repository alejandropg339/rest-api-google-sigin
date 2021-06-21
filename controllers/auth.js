//importacion importante para poder manejar las respuestas del lado de express en desarrollo.
const { response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const generarJWT = require('../helpers/generar-jwt');
const { googleVeify } = require('../helpers/google_verify');

const login = async (req, res) => {

    const { correo, password } = req.body;

    try {

        //verificar email en BD
        const usuario = await Usuario.findOne({ correo });
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Ususario / Password no son correctos'
            });
        }


        //Si el usuario esta ActiveXObject
        if (!usuario) {
            return res.status(400).json({
                msg: 'Ususario / Password no son correctos - estdo: false'
            });
        }

        //verificar la contraseña 
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Ususario / Password no son correctos - pass'
            });
        }


        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            msg: 'algo salio mal hable con el administrador'
        });
    }

}

const googleSigin = async (req, res = response) => {

    const { id_token } = req.body;





    try {
        const { correo, nombre, img } = await googleVeify(id_token);

        //verificar existencia de correo 
        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //crear usuario
            const data = {
                nombre,
                correo,
                password: ':p',
                img,
                google: true
            }

            usuario = new Usuario(data);
            await usuario.save();

        }

        //Si el usuario en DB
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
           usuario,
           token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'Invalid Google token'
        })
    }
}

module.exports = {
    login,
    googleSigin
}