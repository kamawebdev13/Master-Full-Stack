require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
const PORT = 3001;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

async function main() {
    try {
        await client.connect();

        // Usamos base de datos "misTareas"
        const database = client.db("misTareas");
        const tareasColeccion = database.collection("tareas");

        console.log("Conectado a la base de datos: misTareas");

        // 1. Ver todas las tareas (GET /tareas)
        app.get('/tareas', async (req, res) => {
            const listaTareas = await tareasColeccion.find({}).toArray();
            res.json(listaTareas);
        });

        // 2. Ver una tarea específica (GET /tareas/:id)
        app.get('/tareas/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const tarea = await tareasColeccion.findOne({ _id: new ObjectId(id) });

                if (!tarea) {
                    return res.status(404).send(`ID no encontrado en misTareas.`);
                }
                res.json(tarea);
            } catch (error) {
                res.status(400).send("El formato del ID no es válido para MongoDB.");
            }
        });

        // 3. Crear tarea (POST /tareas)
        app.post('/tareas', async (req, res) => {
            if (!req.body.name) {
                return res.status(400).send("Falta el nombre de la tarea.");
            }

            const nuevaTarea = {
                name: req.body.name,
                completada: false //Se puede agregar estados por defecto
            };

            const resultado = await tareasColeccion.insertOne(nuevaTarea);
            res.status(201).json({ _id: resultado.insertedId, ...nuevaTarea });
        });

        // 4. Borrar una tarea (DELETE /tareas/:id)
        app.delete('/tareas/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const resultado = await tareasColeccion.deleteOne({ _id: new ObjectId(id) });

                if (resultado.deletedCount === 0) {
                    return res.status(404).send("No se encontró la tarea para borrar.");
                }

                res.send("Tarea eliminada correctamente de la base de datos.");
            } catch (error) {
                res.status(400).send("ID no válido.");
            }
        });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor activo en el puerto ${PORT}`);
        });

    } catch (e) {
        console.error("Error de conexión:", e);
    }
}

main().catch(console.dir);