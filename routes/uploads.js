const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');
const { validarArchivoSubir } = require('../middlewares');
const { validarCampos } = require('../middlewares/validar-campos');


const router = new Router();

router.post('/', validarArchivoSubir, cargarArchivo);

router.put('/:coleccion/:id', [
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    //Esa funcion custom llama al helper colcciones permitidas que como primer parametro resive la coleccion que se le manda y como segundo las colecciones permitidas
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos,
], actualizarImagenCloudinary);
// ], actualizarImagen);

router.get('/:coleccion/:id', [
    check('id', 'El id debe ser de mongo').isMongoId(),
    //Esa funcion custom llama al helper colcciones permitidas que como primer parametro resive la coleccion que se le manda y como segundo las colecciones permitidas
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)

module.exports = router;