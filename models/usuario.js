// {
//     nombre: 'pepito',
//     correo: 'pepito@gmail.com',
//     password: 'adf1s5f1ag12asd2',
//     img: '45615645615',
//     rol: 'asgsadg',
//     estado: false,
//     google: false

// }

const {Schema, model} = require('mongoose');

const UsuarioShema =Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    }, 
    correo:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'El password es querido']
    },
    img:{
        type: String,
    },
    rol:{
        type: String,
        default:'USER_ROLE',
        required: true
    },
    estado:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    }
});

UsuarioShema.methods.toJSON = function(){
    const {__v, password,_id, ...usuario} = this.toObject();
    usuario.uid = _id;
    return usuario;
}


module.exports = model( 'Usuario', UsuarioShema );