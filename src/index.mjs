import express from "express";
import {finAvailablePort} from '../port.js';
import { mongoose } from "mongoose";

const app = express();

const desiredPort = process.env.PORT ?? 3000;
const URL = process.env.DB_URI;
mongoose.connect(URL,{})
    .then( ()=>{
        console.log("DB Connected!");
    })
    .catch(err=>{console.log(err);});

app.get( 
    '/api/users', 
    (request, response)=>{
        response.status(201).send({msg:'Hello'});
    }
);

finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});
