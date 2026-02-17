import dotenv from 'dotenv';
import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

dotenv.config();

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

// 1. Ver todos las peliculas (GET)
app.get('/peliculas', express.json(), async (req, res) => {
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

// Arrancamos todo
async function iniciarServidor() {
    await conectarDB(); // Primero conectamos
    app.listen(PORT, '0.0.0.0', () => { // Luego escuchamos
        console.log(`Servidor listo en http://localhost:${PORT}`);
    });
}

iniciarServidor();