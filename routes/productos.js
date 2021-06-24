const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, obtenerProductos, obtenerProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { existeCategoriaPorId, existeProductoPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = new Router();


//Obtener todas las categorias - publico
router.get('/',obtenerProductos);


//Obtener una categoria por id - publico (Hacer un middleware para validar el id)
router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], 
obtenerProducto);


//Crear categoria - privado con cualquier token valido
router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un id de Mongo').isMongoId(),
    check('categoria').custom( existeCategoriaPorId ),
    validarCampos
], crearProducto );


//Actualizar una categoria - privado con cualquiera con token valido
router.put('/:id',[
    validarJWT,
    // check('categoria', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);


// Eliminar una categoria - privado con solo un admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],eliminarProducto);

module.exports = router;