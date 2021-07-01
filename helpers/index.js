const dbValidators = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVeify = require('./google_verify');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...dbValidators,        
    ...generarJWT,    
    ...googleVeify,
    ...subirArchivo    
}