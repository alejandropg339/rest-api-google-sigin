const { response } = require("express");
const { Categoria, Producto } = require("../models");

//Obtener categorias -paginado - total - populate(mogoose)

const obtenerProductos = async (req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'nombre')
            .populate('categoria', 'nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        productos
    });
}

//Obtener categoria - populate(mogoose)

// const obtenerProducto = async (req, res = response) => {

//     const { id } = req.params;

//     const productoDB = await Producto.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');

//     if (!productoDB) {
//         res.status(401).json({
//             msg: `La categoria con el id:${id} no existe`
//         })
//     }

//     res.json({
//         productoDB
//     })
// }

const obtenerProducto = async(req, res = response ) => {

    const { id } = req.params;
    const producto = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre');

    res.json( producto );

}

const crearProducto = async (req, res = response) => {

    const { estado, usuario , ...body} = req.body;

    // const categoriaExistente = await Categoria.findOne({ nombre: categoria });

    // if(!categoriaExistente){
    //     res.status(400).json({
    //         msg:`La categoria ${categoria} en la que intenta registrar el producto no existe` 
    //     });
    // }

    const productoDB = await Producto.findOne({ nombre:body.nombre });

    if (productoDB) {
        res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre: body.nombre.toUpperCase(),
        precio: body.precio,
        categoria:body.categoria,
        descripcion:body.descripcion,
        usuario: req.usuario._id
    }

    const producto = new Producto(data);

    //Guardar DB
    await producto.save();

    res.status(201).json(producto)
}

//Actualizar categoria - nombre

const actualizarProducto = async (req, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const productoActualizado = await Producto.findByIdAndUpdate(id, data, { new: true });

    if (!productoActualizado) {
        res.status(404).send(`No se encontro la categoria con el id: ${id}`);
    }

    res.json(productoActualizado);
}


//Borrar categoria (estado false)

const eliminarProducto = async (req, res = response) => {

    const { id } = req.params;

    const deleteProducto = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    if (!deleteProducto) {
        res.status(404).json({
            msg: "La categoria que intenta eliminar no fue encontrada"
        });
    }


    res.json(deleteProducto);
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto
}