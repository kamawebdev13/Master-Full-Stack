import dotenv from 'dotenv';
import express from 'express';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

dotenv.config();

const app = express();
app.use(express.json()); // ¡Importante! Para poder leer el Body de Postman
const PORT = 3000;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

// Definimos la colección globalmente para usarla en todas las rutas
let librosColeccion;

async function conectarDB() {
    try {
        await client.connect();
        const db = client.db("biblioteca");
        librosColeccion = db.collection("libros");
        console.log("Conexión exitosa a MongoDB: Biblioteca");
    } catch (error) {
        console.error(" Error al conectar a MongoDB:", error);
    }
}

// 1. Ver todos los libros (GET)
app.get('/libros', async (req, res) => {
    try {
        const listaLibros = await librosColeccion.find({}).toArray();
        res.json({ success: true, data: listaLibros });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. Agregar un libro nuevo (POST)
app.post('/libros', async (req, res) => {
    try {
        const { titulo, autor, genero } = req.body;

        if (!titulo || !autor) {
            return res.status(400).json({ success: false, message: "Faltan datos obligatorios." });
        }

        const nuevoLibro = { titulo, autor, genero, fechaRegistro: new Date() };
        const resultado = await librosColeccion.insertOne(nuevoLibro);
        
        res.status(201).json({ success: true, _id: resultado.insertedId, ...nuevoLibro });
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