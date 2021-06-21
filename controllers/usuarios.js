const { response } = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');


const usuariosGet = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    // const usuarios = await Usuario.find(query)
    //     .skip(Number(desde))
    //     .limit(Number(limite));

    // const total = await Usuario.countDocuments(query);

    //Promise.all ejecuta ambas promesas de manera simultanea por lo que no bloquea el codigo en diferentes tiempos, si una falla todas fallan
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req, res = response) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync(); // salt es el numero de vueltas con el que se encripta la contraseña por defecto son 10
    usuario.password = bcryptjs.hashSync(password, salt)

    //Guardar en Base datos

    await usuario.save();


    res.json({
        msg: 'post API - controller',
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    //Validar con base de datos
    if (password) {
        //Encriptar contraseña
        const salt = bcryptjs.genSaltSync(); // salt es el numero de vueltas con el que se encripta la contraseña por defecto son 10
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosDelete = async(req, res = response) => {

    const { id } = req.params;

    // const uid = req.uid;

    //Fisicamente borrar
    // const usuario = await Usuario.findByIdAndDelete(id);

    //Cambiar estado 
    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});

    //Usuario autenticado
    const usuarioAutenticado = req.usuario;

    res.json({
        usuario,
        usuarioAutenticado
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}