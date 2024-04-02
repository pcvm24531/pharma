const express = require('express');
const app = express();

const desiredPort = process.env.PORT ?? 3000;

const mockUsers = [
    {id:1, name:'Pablo', lastName:'Vargas'},
    {id:2, name:'Cesar', lastName:'Morales'},
    {id:3, name:'Limbert', lastName:'Gutierrez'},
];

app.listen( desiredPort, ()=>{
    console.log(`Conected by port: ${desiredPort}`);
});

app.get("/api/users", (request, response)=>{
    return response.status(200).send(mockUsers);
});

app.get("/api/users/:id", (request, response)=>{
    const parsedId = parseInt(request.params.id);
    if ( isNaN(parsedId) ) {
        return response.status(400).send( {msg: 'Bad request. Invalid ID.'} );
    }

    const findUser = mockUsers.find( (user)=> parsedId===user.id );
    if( !findUser ) return response.status(404);

    return response.status(200).send(findUser);
});




