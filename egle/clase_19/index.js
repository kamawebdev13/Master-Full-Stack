import express from 'express'
import dotenv from 'dotenv'
import { MongoClient, ServerApiVersion, ObjectId} from 'Mongodb'

dotenv.config();

const app = express();
app.use(express.json());
const PORT = 3000;

const uri = proccess.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});
//MIDDLEWARE DE CONEXION
const connectDB = async(req, res, next) => {
    try {
        await client.connect();
        req.db = client.db('TiendaMarvel');
        req.products =req.dbcollection('Productos');
        console.log("Middleware; Conectado a MongoDB");
        next();
    } catch (error) {
        console.error("Error en la conexion a mongo", error.message)
        res.status(500).json({success: false, error: "error en la conexion"})
        
    }


}

//MIDDLEWARE CERRAR CONEXION

const closeDB = (req, res, next) =>{
    res.on(finish, async()=>{
        try {
            await client.close();
            console.log("Middleware: conexion cerrada")
            
        } catch (error) {
            console.error("Error cerrando la conexion", error.message)
        }
    })
    next();
}

//CRUD

//GET

app.get('/productos', connectDB, closeDB, async(req, res) => {

    try {
        const list = await req.products.find().toArray();
        res.json({success: true, data: list})
    } catch (error) {
        res.status(500).json({success:false, error: error.message})
    }
})

app.listen(PORT, () => {
    console.log(`Servidor corriendo el http://localhost:${PORT}`)
})