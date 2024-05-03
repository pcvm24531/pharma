import express from "express";
import {finAvailablePort} from '../port.js';

const app = express();

const desiredPort = process.env.PORT ?? 3000;

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
