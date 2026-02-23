import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

import express from 'express'
import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

dotenv.config();

const app = express();
app.use(express.json())
const PORT = 3001;
const DB_NAME = 'SistemaCine';

const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

let db;

const collections = {
    directores: 'directores',
    peliculas: 'peliculas'
}

// MIDDLEWARE PA VALIDADR OBJETC ID
const validateId = (req, res, next)=>{
    const { id } = req.params;
    if(!ObjectId.isValid(id)){
        return res.status(400).json({sucess: false, error: 'ID Invalido'})
    }
    next();
}

// MIDDLEWARE CARGAR COLECCTION POR RECURSO
const useCollection = (nameCollection) => (req, res, next) => {
    if(!db){
        return next(new Error ('La base de datos no esta actualizada'))
    }
    req.collection = db.collection(nameCollection);
    next();
}

// Factory crear crud reutilizable

const createRouterCrud = (nameResource, nameCollection) => {
    const router = express.Router();

    router.use(useCollection(nameCollection));

    router.get('/', async(req, res, next)=>{
        try {
            const list = await req.collection.find({}).toArray();
            res.json({sucess: true, recurso: nameResource, total: list.length, data: list})
        } catch (error) {
            next(error)
        }
    })

    router.post('/', async(req, res, next)=> {
        try {
            const result = await req.collection.insertOne(req.body)
            res.status(201).json({sucess: true, message: `${nameResource} creado`, insertedId: result.insertedId})
        } catch (error) {
            next(error)
        }
    })

    router.put('/:id', validateId, async(req, res, next)=>{
        try {
            const { _id, ...updateData } = req.body;
            const result = await req.collection.updateOne(
                {_id: new ObjectId(req.params.id)},
                {$set: updateData}
            )
            if(result.matchedCount === 0){
                return res.status(404).json({sucess: false, message: `${nameResource} no encontrado`})
            }
            res.json({sucess: true, message: `${nameResource} actualizado`, modifiedCount: result.modifiedCount})
        } catch (error) {
            next(error)
        }
    })

    router.delete('/:id', validateId, async(req, res, next)=>{
        try {
            const result = await req.collection.deleteOne(
                {_id: new ObjectId(req.params.id)}
            )
            if(result.deletedCount === 0){
                return res.status(404).json({sucess: false, message: `${nameResource} no encontrado`})
            }
            res.json({sucess: true, message: `${nameResource} eliminado`, deletedCount: result.deletedCount})
        } catch (error) {
            next(error)
        }
    })
    return router;
}

// ==========================================
// RUTAS - Se monta un CRUD por colección
// ==========================================


app.use('/directores', createRouterCrud('Director', collections.directores))
app.use('/peliculas', createRouterCrud('Pelicula', collections.peliculas))


// MIDDLEWARE DE ERRORES GLOBALES
app.use((err, req, res, next)=>{
    console.error('Error no contralado:', err.message)
    if(res.headerSent){
        return next(err)
    }
    res.status(err.statusCode || 500).json({sucess:false, error: err.message || 'Error interno del Server'})
})

// MIDDLEWARE PARA LEVANTAR SERVER + INICIALIZAR DB
const initServer = async () => {
    try {
        await client.connect();
        db = client.db(DB_NAME)
        console.log(`Conectado a mongo, la base activa es: ${DB_NAME}`)
        app.listen(PORT, () => {
            console.log(`🚀 Servidor CRUD corriendo en http://localhost:${PORT}`);
            console.log('📍 Endpoints disponibles:');
            console.log('   GET|POST|PUT|DELETE /directores');
            console.log('   GET|POST|PUT|DELETE /peliculas');
         
    });
    } catch (error) {
        console.error('No se pudo iniciar el server', error.message)
        process.exit(1)
    }
}

const closeServer = async (signal) => {
    try {
        await client.close();
        console.log(`Conexion cerrada por señal ${signal}`)
        process.exit(0)
    } catch (error) {
        console.error('Error cerrando MongoDB', error.message)
        process.exit(1)
    }
}

process.on('SIGINT', () => closeServer('SIGINT') );
process.on('SIGTERM', ()=> closeServer('SIGTERM'))

initServer();