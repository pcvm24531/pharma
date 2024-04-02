const express = require('express');
const {finAvailablePort} = require('./port');

const app = express();

const desiredPort = process.env.PORT ?? 3000 ;

const mockUsers = [
    {id:1, name:'Pablo', lastName:'Vargas'},
    {id:2, name:'Hugo', lastName:'Lopez'},
    {id:3, name:'Marco', lastName:'Mora'},
];

app.get('/api/users',(require, response)=>{
    response.status(201).send( mockUsers );
});
app.get('/api/users/:id', (request, response)=>{
    const parsedId = parseInt(request.params.id);
    const user = mockUsers.findIndex( (id)=> parsedId===id );
    console.log(user);
})

finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});