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


// Configuracion del Post
app.post('/productos', conectDB, closeDB, async(req, res) =>{
    try {
        const result = await req.products.insertOne(req.body);
        res.json({success: true, message: "Producto Creado", insertedID: result.insertedID})
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

// Configuracion del Put
app.put('/productos/:id', conectDB, closeDB, async(req, res) =>{
    try {
        const result = await req.products.updateOne(
            {_id: new ObjectId(req.params.id)},
            { $set: req.body }
        )

        if(result.matchedCount === 0){
            res.status(404).json({success: false, message: "Producto no encontrado"})
        }else{
            res.json({success: true, message: "Producto Actualizado", modiedCount: result.modiedCount})
        }

    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

// Configruacion del Delete
app.delete('/productos/:id', conectDB, closeDB, async(req, res) =>{
    try {
        const result = await req.products.deleteOne(
            {_id: new ObjectId(req.params.id)},
        )
        if(result.deletedCount === 0){
            res.status(404).json({success: false, message: "Producto a Borrar no encontrado"})
        }else{
            res.json({success: true, message: "Producto Eliminado", deletedCount: result.deletedCount})
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

app.listen(PORT, () => {
  console.log(`🚀 Servidor CRUD corriendo en http://localhost:${PORT}`);
  console.log('📍 Endpoints disponibles:');
  console.log('   GET    /productos         - Obtener todos los productos');
  console.log('   POST   /productos         - Crear un nuevo producto');
  console.log('   PUT    /productos/:id     - Actualizar un producto');
  console.log('   DELETE /productos/:id     - Eliminar un producto');
});
