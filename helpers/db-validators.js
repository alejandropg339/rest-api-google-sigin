const Role = require('../models/role');
const Usuario = require('../models/usuario');

//Verificar si el rol existe y es valdio
const esRoleValido = async(rol = '')=>{

    const existRol = await Role.findOne({rol});
    if(!existRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos`);
    }
}

//Verificar si el correo existe
const emailExiste = async (correo = '')=>{
    const existeEmail = await Usuario.findOne({correo});
    if(existeEmail){

        throw new Error(`El correo ${correo} ya esta registrado en la base de datos`);
    }
}

//Verificar si el id existe
const existeUsuarioPorId = async (id)=>{
    const existeUsuario = await Usuario.findById(id);
    if(!existeUsuario){

        throw new Error(`El id ${id} no existe`);
    }
}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
}