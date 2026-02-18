import { setServers } from "node:dns/promises";
setServers(["1.1.1.1", "8.8.8.8"]);

import dotenv from 'dotenv'
import { MongoClient, ObjectId, ServerApiVersion } from 'mongodb'
import express from 'express'

dotenv.config();

const app = express();
const PORT = 3004;

const uri = process.env.MONGODB_URI

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors:true
    }
})

// GET - OBTENER DATOS

app.get('/pets', async (req, res) => {
    try {
        await client.connect();
    const database = client.db("Paw_Patrol")
    const petsColeccion = database.collection("Pets")
    const list = await petsColeccion.find({}).toArray();
    res.json({success: true, data: list})
    } catch (error) {
        res.status(500).json({success: false, error: error.message })
    }finally{
        await client.close();
    }
})

// POST - CREAR DATOS

app.post('/pets', express.json(), async (req, res) =>{
    try {
        await client.connect();
        const database = client.db("Paw_Patrol")
        const petsColeccion = database.collection("Pets")
        const result = await petsColeccion.insertOne(req.body)
        res.json({success: true, insertedId: result.insertedId})
    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }finally{
        await client.close();
    }
} )

// UPDATE - ACTUALIZAR DATOS

app.put('/post/:id', express.json(), async (req, res)=> {
    try {
        await client.connect();
        const database = client.db("Paw_Patrol");
        const petsColeccion = database.collection("Pets");

        const result = await petsColeccion.updateOne(
            { _id: new ObjectId(req.params.id)},
            { $set: req.body }
        );
        
        if(result.matchedCount === 0){
            res.status(404).json({sucess: false, message: "Mascota no encontrada, ingrese otra"})
        }else{
            res.json({success: true, message: "Se actualizo la base de datos", modifiedCount: result.modifiedCount})
        }


    } catch (error) {
        res.status(500).json({success: false, error: error.message})
    }finally{
        await client.close();
    }
})


// DELETE - ELIMINAR DATOS

app.delete('/pets/:id', async(req, res) => {
   try {
     await client.connect();
    const database = client.db("Paw_Patrol");
    const petsColeccion = database.collection("Pets");

    const result = await petsColeccion.deleteOne({
        _id: new ObjectId(req.params.id)
    })

    if (result.deletedCount === 0) {
        res.status(404).json({success: true, message: "Mascota no encontrada, ingrese otra"})
    }else{
        res.json({ success: true, message: "Mascota eliminada en la base de datos ojo!", deletedCount: result.deletedCount})
    }
   } catch (error) {
    res.status(500).json({success: false, error: error.message })
   }finally{
     await client.close();
   }

})


app.listen(PORT, () => {
    console.log(`Servidor corriendo el http://localhost:${PORT}`)
})