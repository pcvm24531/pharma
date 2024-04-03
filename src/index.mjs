const express = require('express');
const {finAvailablePort} = require('../port');
const{ query, validationResult, body, matchedData } = require('express-validator');

import { createUserValidationSchema } from "./utils/validationSchemas.mjs";

const app = express();
app.use(express.json());

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

const mockUsers = [
    {id:1, name:'Pablo', lastName:'Vargas'},
    {id:2, name:'Hugo', lastName:'Lopez'},
    {id:3, name:'Marco', lastName:'Mora'},
];

/*app.get(
    '/api/users',    
    (require, response)=>{
        response.status(201).send( mockUsers );
    }
);*/
//Ejemplo get user con query => filter, value
app.get(
    '/api/users',
    query("filter")
        .isString()
        .notEmpty()
        .withMessage('Must not be empty')
        .isLength({min:3, max:10})
        .withMessage('Must be at least 3-10 characters'),
    (request, response)=>{
        const result = validationResult(request);
        console.log(result);
        const {query:{filter, value}} = request;
        //Si el filtro y valor no han sido definidos
        if( !filter && !value ) return response.status(200).send(mockUsers);
        if( filter && value ) 
            return response.send(
                mockUsers.filter( (user)=> user[filter].includes(value) )
            );        
        return response.send(mockUsers);
    }
);

app.get('/api/users/:id',resolveIndexByUserId ,(request, response)=>{
    const {findUserIndex}=request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) return response.status(404);
    return response.status(200).send(findUser);
});

//Ejemplo Save Users
app.post(
    '/api/users',
    checkSchema(createUserValidationSchema),
    (request, response)=>{
        const result = validationResult(request);
        if( !result.isEmpty() ) return response.status(400).send({error: result.array()})

        const data = matchedData(request);
        console.log(data);

        const {body} = request;        
        const newUser = { id: mockUsers[mockUsers.length-1].id+1 , ...body  }
        mockUsers.push(newUser);
        return response.status(200).send(mockUsers);
    }
);

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