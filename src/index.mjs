import express from "express";
import 'dotenv/config';
import {finAvailablePort} from '../port.js';
import { mongoose } from "mongoose";
import {mockUsers} from "./utils/constants.mjs"


const app = express();

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

const resolveIndexByUserId = (request, response, next)=>{
    const {
        body,
        params:{id}
    } = request;
    const parseId = parseInt(id);
    if( isNaN(parseId) ) return response.status(400).send({msg:'Bad request. User id invalid'})

    const findUserIndex = mockUsers.findIndex( (user)=>{ user.id===parseId } );
    if( findUserIndex === -1 ) return response.status(404).send({msg:'Not found'});
    request.findUserIndex = findUserIndex;
    next();
}

//Starting funcionality
app.get(
    '/api/users',
    logginMiddleware,
    (request, response)=>{
        response.status(201).send({msg:'This is users GET method'})
    }
);

app.get(
    '/api/users/:id',
    logginMiddleware,
    (request, response)=>{
        const parseId = parseInt(request.params.id);
        if ( isNaN(parseId) ) return response.status(400).send({msg:'Bad request. Invalid ID'});

        //Buscamos el usuario
        return response.status(200).send({msg:'The user is: '+parseId});
    }
);