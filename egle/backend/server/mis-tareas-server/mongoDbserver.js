import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
dotenv.config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

async function run() {
    try {
        await client.connect();
        // El ping confirma que hay conexión real
        await client.db("admin").command({ ping: 1 });
        console.log("¡Conexión exitosa a MongoDB!");

        const dbName = "biblioteca";

        // CORRECCIÓN AQUÍ: Usamos directamente client.db().admin() 
        // para listar las bases de datos.
        const adminDb = client.db().admin();
        const dbList = await adminDb.listDatabases(); 

        const exist = dbList.databases.some((db) => db.name === dbName);

        if (exist) {
            console.log(`La base de datos "${dbName}" existe.`);
        } else {
            console.log(`La base de datos "${dbName}" no existe aún.`);
        }
        
    } catch (error) {
        console.error(" Error de conexión:", error);
        await client.close();
    } 
}

run().catch(console.dir);