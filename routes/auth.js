const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSigin } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = new Router();

router.post('/login',[
    check('correo', 'El correo es Obligatorio').isEmail(),
    check('password', 'La contraseña es Obligatoria').not().isEmpty(),
    validarCampos
], login);

router.post('/google',[
    check('id_token', 'El id token es necesario').not().isEmpty(),
    validarCampos
], googleSigin);

module.exports = router;