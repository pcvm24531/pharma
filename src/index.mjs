import express from "express";
import {finAvailablePort} from '../port.js';
import {query, validationResult, body, checkSchema} from "express-validator";
import { createUserValidationSchema } from "./utils/validationSchemas.mjs";
import usersRouter from "./routes/users.mjs";
import {mockUsers} from './utils/constants.mjs';

const app = express();
app.use(express.json());
app.use(usersRouter);

const logginMiddleware = (request, response, next)=>{
    console.log(`${request.method} - ${request.url}`);
    next();
}

const resolveIndexByUserId = (request, response, next)=>{
    const {
        params:{id}
    }=request;
    const parsedId = parseInt(id);
    if( isNaN(parsedId) ) return response.status(400).send({msg:"Bad Request. Invalid ID"})
    const findUserIndex = mockUsers.findIndex( (user)=>user.id===parsedId );
    if( findUserIndex === -1 ) return response.status(404).send({msg:'Not Found'})
    request.findUserIndex = findUserIndex;
    next();
}


const desiredPort = process.env.PORT ?? 3000;



/*app.get(
    '/api/users',    
    (require, response)=>{
        response.status(201).send( mockUsers );
    }
);*/
//Ejemplo get user con query => filter, value

app.get('/api/users/:id',resolveIndexByUserId ,(request, response)=>{
    const {findUserIndex}=request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) return response.status(404);
    return response.status(200).send(findUser);
});

//Ejemplo Save Users


//Ejemplo actualizar informacion
app.put('/api/users/:id', resolveIndexByUserId, (request, response)=>{
    const {body, findUserIndex}=request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.status(200).send(mockUsers);
} );

//Ejemplo usamos patch para agregar un nuevo campo/atributo/etc
app.patch("/api/users/:id",resolveIndexByUserId ,(request, response)=>{
    const {body,findUserIndex} = request;  
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return response.status(200).send(mockUsers);
} );

app.delete("/api/users/:id",resolveIndexByUserId ,(request, response)=>{
    const {findUserIndex}=request;
    mockUsers.splice(findUserIndex, 1);
    return response.status(200).send(mockUsers);
});



finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});