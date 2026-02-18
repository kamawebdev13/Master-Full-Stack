import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from 'dotenv';
import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

dotenv.config();

const app = express();
app.use(express.json()); // ¡Importante! Para poder leer el Body de Postman
const PORT = 3002;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

// Definimos la colección globalmente para usarla en todas las rutas
let PelisColeccion;

async function conectarDB() {
    try {
        await client.connect();
        const db = client.db("blockbuster");
        PelisColeccion = db.collection("pelis");
        console.log("Conexión exitosa a MongoDB: blockbuster");
    } catch (error) {
        console.error(" Error al conectar a MongoDB:", error);
    }
}

// 1. Ver todos las peliculas (GET)// endpoint de GET para obtener datos
app.get('/peliculas', async (req, res) => {
    try {
        const listaPeliculas = await PelisColeccion.find({}).toArray();
        res.json({ success: true, data: listaPeliculas });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. Agregar una pelicula nueva (POST)
app.post('/peliculas', async (req, res) => {
    try {
        const { titulo, director, estreno , genero, } = req.body;

        if (!titulo || !director) {
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
        }

        const nuevaPelicula = {titulo, director, estreno , genero,  fechaRegistro: new Date() };
        const resultado = await PelisColeccion.insertOne(nuevaPelicula);
        
        res.status(201).json({ success: true, _id: resultado.insertedId, ...nuevaPelicula });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// 3. Actualizar una pelicula (PUT)

app.put('/peliculas/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { titulo, director, estreno, genero } = req.body;

        if (!titulo || !director) {
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
        }

        const resultado = await PelisColeccion.updateOne(
            { _id: new ObjectId(id.trim()) },
            { $set: { titulo, director, estreno, genero } }
        );

        if (resultado.matchedCount === 0) {
            return res.status(404).json({ success: false, message: "No se encontró la película." });
        }

        res.json({ success: true, message: "Película actualizada correctamente." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});



// Borrar una pelicula (DELETE)
app.delete('/peliculas/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await PelisColeccion.deleteOne({ _id: new ObjectId(id.trim()) });

        if (resultado.deletedCount === 0) {
            return res.status(404).json({ success: false, message: "No se encontró la película." });
        }

        res.json({ success: true, message: "Película eliminada correctamente." });
    } catch (error) {
        res.status(400).json({ success: false, message: "El formato del ID no es válido." });
    }
});

// Arrancamos todo
async function iniciarServidor() {
    await conectarDB(); // Primero conectamos
    app.listen(PORT, '0.0.0.0', () => { // Luego escuchamos
        console.log(`Servidor listo en http://localhost:${PORT}`);
    });
}

iniciarServidor();