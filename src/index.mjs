import express from "express";
import {finAvailablePort} from '../port.js';
import { mockUsers } from "./utils/constants.mjs";
import { mongoose } from "mongoose";
import { User } from "./mongoose/schemas/users.mjs"

const app = express();

mongoose.connect('mongodb://localhost/pharma')
    .then( ()=>console.log('DB Connected') )
    .catch( (err)=>console.log(`Error: ${err}`) );

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
        response.status(201).send(mockUsers);
    }
);

app.get(
    '/api/users/:id',
    (request, response)=>{
        const parsedId = parseInt(request.params.id);
        //Si el id no es valido
        if ( isNaN(parsedId) ) return request.status(400).send({msg:'Invalid request'});

        //Si el id es
        const findUser = mockUsers.find( (user) => user.id===parsedId );
        if( !findUser ) return response.status(404).send({msg:'Empty'});

        response.status(200).send(findUser);
    },
);

finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});
