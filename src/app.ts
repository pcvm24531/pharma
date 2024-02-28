import "dotenv/config";
import express from "express";
import cors from "cors";
import {router} from "./routes";

const app = express();
app.use(cors());//cors -> especifica que la api puede ser comsumido desde cualquier parte
app.use(router);
const PORT = process.env.PORT || 3001;

app.listen( PORT, ()=>console.log(`Conectado por el puerto  ${PORT}`) );

