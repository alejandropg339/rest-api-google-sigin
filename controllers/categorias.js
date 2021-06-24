const { response } = require("express");
const { Categoria } = require("../models");
const { findByIdAndUpdate } = require("../models/categoria");

//Obtener categorias -paginado - total - populate(mogoose)

const obtenerCategorias = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            . populate('usuario', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        categorias
    });
}

//Obtener categoria - populate(mogoose)

const obtenerCategoriaPorId = async (req, res = response) => {

    const { id } = req.params;

    const categoriaDB = await Categoria.findById(id).populate('usuario', 'nombre');

    if (!categoriaDB) {
        res.status(401).json({
            msg: `La categoria con el id:${id} no existe`
        })
    }

    res.json({
        categoriaDB
    })
}

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar DB
    await categoria.save();

    res.status(201).json(categoria)
}

//Actualizar categoria - nombre

const actualizarCategoria = async (req, res = response) => {

    const { id } = req.params;
    const {estado, usuario, ...data} = req.body;
    
    data.nombre = data.nombre.toUpperCase();

    data.usuario = req.usuario._id;

    const categoriaActualizada = await Categoria.findByIdAndUpdate(id, data, { new:true });

    if (!categoriaActualizada) {
        res.status(404).send(`No se encontro la categoria con el id: ${id}`);
    }

    res.json(categoriaActualizada);
}


//Borrar categoria (estado false)

const eliminarCategoria = async (req, res= response) => {

    const {id} = req.params;
    
    const deleteCategorie = await Categoria.findByIdAndUpdate(id, {estado: false}, {new:true});

    if(!deleteCategorie){
        res.status(404).json({
            msg:"La categoria que intenta eliminar no fue encontrada"
        });
    }


    res.json(deleteCategorie);
}

module.exports = {
    obtenerCategorias,
    obtenerCategoriaPorId,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria
}