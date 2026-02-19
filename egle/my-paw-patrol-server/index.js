// REFACTORIZACION DE CODIGO MY PAW PATROL SERVER 
import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

import express from 'express'
import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb'

dotenv.config();

const app = express();
app.use(express.json())
const PORT = 3005;

const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true, deprecationErrors: true
    }
});

// MIDDLEWARE DE CONEXION
const conectDB = async (req, res, next) => {
    try {
        await client.connect();
        req.db = client.db('Paw_Patrol');
        req.pets = req.db.collection('Pets');
        console.log("Midlleware: Conectado a MongoDB")
        next();
    } catch (error) {
        console.error("Error en la conexion a mongo", error.message)
        res.status(500).json({ success: false, error: "Error en la conexion" })
    }
}

// MIDDLEWARE DE CERRAR LA CONEXION
const closeDB = (req, res, next) => {
    res.on('finish', async () => {
        try {
            await client.close();
            console.log("Middleware: Conexion Cerrada")
        } catch (error) {
            console.error("Error cerrando la conexion", error.message)
        }
    })
    next();
}

// Configuracion del Get
app.get('/pets', conectDB, closeDB, async (req, res) => {
    try {
        const list = await req.pets.find({}).toArray();
        res.json({
            success: true,
            message: "Lista de mascotas recuperada 🐶🐱",
            data: list
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `Error en el cuartel Paw Patrol: 🚨 ${error.message}`
        });
    }
})



// Configuracion del Post
app.post('/pets', conectDB, closeDB, async (req, res) => {
    try {
        const result = await req.pets.insertOne(req.body);
        res.json({ success: true, message: "Mascota registrada 🐶🐱", insertedID: result.insertedID })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: `Error en el cuartel Paw Patrol: 🚨 ${error.message}`
        });
    }
})

// Configuracion del Put
app.put('/pets/:id', conectDB, closeDB, async (req, res) => {
    try {
        const result = await req.pets.updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: req.body }
        )

        if (result.matchedCount === 0) {
            res.status(404).json({ success: false, message: "Mascota 🐶🐱 no encontrada" })
        } else {
            res.json({ success: true, message: "Mascota Actualizada 🐶🐱 ", modifiedCount: result.modifiedCount })
        }

    } catch (error) {
        res.status(500).json({ success: false, error: `Error en el cuartel Paw Patrol: 🚨 ${error.message}` });
    }
})

// Configruacion del Delete
app.delete('/pets/:id', conectDB, closeDB, async (req, res) => {
    try {
        const result = await req.pets.deleteOne(
            { _id: new ObjectId(req.params.id) },
        )
        if (result.deletedCount === 0) {
            res.status(404).json({ success: false, message: "Mascota a Borrar no encontrada" })
        } else {
            res.json({ success: true, message: "Mascota Eliminado", deletedCount: result.deletedCount })
        }
    } catch (error) {
        res.status(500).json({ success: false, error: `Error en el cuartel Paw Patrol: 🚨 ${error.message}` });
    }
})

app.listen(PORT, () => {
    console.log(`🚀 Servidor CRUD corriendo en http://localhost:${PORT}`);
    console.log('📍 Endpoints disponibles:');
    console.log('   GET    /pets        - Obtener todas las mascotas');
    console.log('   POST   /pets        - Registrar una nueva mascota');
    console.log('   PUT    /pets/:id     - Actualizar una mascota');
    console.log('   DELETE /pets/:id     - Eliminar una mascota');
});
