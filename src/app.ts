import "dotenv/config";
import express from "express";
import cors from "cors";
import {router} from "./routes";
import db from "./config/mongo";

const PORT = process.env.PORT || 3001;
const app = express();
app.use(cors());//cors -> especifica que la api puede ser comsumido desde cualquier parte
app.use(router);
app.use(express.json);
db().then( ()=>{console.log('Conexion DB ready');
} );
app.listen( PORT, ()=>console.log(`Conectado por el puerto  ${PORT}`) );

