import express from "express";
import 'dotenv/config';
import {finAvailablePort} from '../port.js';
import { mongoose } from "mongoose";
import router from "./routes/index.mjs";


const app = express();

app.use(express.json);
app.use(router);

const desiredPort = process.env.PORT ?? 3000;
const DB_CONN = process.env.URI_DB;

mongoose.connect( DB_CONN)
    .then( ()=>console.log('DB Connected') )
    .catch( (err)=>console.log(`Error: ${err}`) );

finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});

const logginMiddleware = (request, response, next)=>{
    console.log(`${request.method} - ${request.url}`);
    next();
};