const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
require('dotenv').config();

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        //PATHS
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        //Database Connection
        this.conectarDB();


        //Middlewares: Funciion que siempre se ejecura cuando se ejecuta nuestro servidor 
        this.middlewares();
        //Rutas

        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares() {
        //CORS 
        this.app.use(cors());

        //Lectura y parseo del body
        this.app.use(express.json());

        //Directorio publico (Los middleware utilizan siempre al palabra reservada use)
        this.app.use(express.static('public'));
    }

    routes() {
        //Configuracion de middleware y el path para acceder a las rutas especificadas
        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));
    }

    listen() {
        
        this.app.listen(this.port, () => {
            console.log(`Aplicacion corriendo en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;