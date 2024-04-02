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

app.get('/api',(request, response)=>{
    return response.status(200).send('Hello!');
});

app.get("/api/users", (request, response)=>{
    return response.status(200).send(mockUsers);
});

app.get('/api/users/:id', (request, response)=>{
    return response.status(200).send('Only user');
});

