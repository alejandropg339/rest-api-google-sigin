const Role = require('../models/role');
const {Usuario, Categoria, Producto} = require('../models');

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

//Verificar si el id de la categoria existe
const existeCategoriaPorId = async (id)=>{
    const existeUsuario = await Categoria.findById(id);
    if(!existeUsuario){

        throw new Error(`El id ${id} no existe`);
    }
}

//Verificar si el id de la categoria existe
const existeProductoPorId = async (id)=>{
    const existeProducto = await Producto.findById(id);
    if(!existeProducto){

        throw new Error(`El id ${id} no existe`);
    }
}

//validar las coleccines permitidas

const coleccionesPermitidas = (coleccion= '', colecciones=[])=>{

    const incluida = colecciones.includes(coleccion);

    if(!incluida){
        throw new Error(`La coleccion ${coleccion}, no es permitida, ${colecciones}`);
    }

    return true;

}

module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId,
    coleccionesPermitidas
}