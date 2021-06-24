const { Router } = require('express');
const { check } = require('express-validator');
const { crearCategoria, obtenerCategorias, obtenerCategoriaPorId, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = new Router();


//Obtener todas las categorias - publico
router.get('/',obtenerCategorias);


//Obtener una categoria por id - publico (Hacer un middleware para validar el id)
router.get('/:id', [
    check('id', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], 
obtenerCategoriaPorId);


//Crear categoria - privado con cualquier token valido
router.post('/', [
    validarJWT,
    check('nombre','El nombre es Obligatorio').not().isEmpty(),
    validarCampos
],  crearCategoria);


//Actualizar una categoria - privado con cualquiera con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);


//Eliminar una categoria - privado con solo un admin
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id', 'No es un id valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],eliminarCategoria);

module.exports = router;