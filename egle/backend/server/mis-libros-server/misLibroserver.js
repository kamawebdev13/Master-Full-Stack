require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
const PORT = 3000;

const uri = process.env.MONGODB_URI; 
const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function main() {
    try {
        await client.connect();
        const database = client.db("biblioteca"); // Nueva DB
        const librosColeccion = database.collection("libros"); 
        console.log("Conectado a la colección de LIBROS");

        // --- RUTAS ---

        // 1. Ver todos los libros
        app.get('/libros', async (req, res) => {
            const listaLibros = await librosColeccion.find({}).toArray();
            res.json(listaLibros);
        });

        // 2. Agregar un libro nuevo
        app.post('/libros', async (req, res) => {
            const { titulo, autor, genero } = req.body;
            
            if (!titulo || !autor) {
                return res.status(400).send("Faltan datos obligatorios (titulo y autor).");
            }

            const nuevoLibro = { titulo, autor, genero, fechaRegistro: new Date() };
            const resultado = await librosColeccion.insertOne(nuevoLibro);
            res.status(201).json({ _id: resultado.insertedId, ...nuevoLibro });
        });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor de Libros corriendo en puerto ${PORT}`);
        });

    } catch (e) {
        console.error(e);
    }
}

main().catch(console.dir);