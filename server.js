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
    //Verificamos si el parametro es válido
    if( isNaN(parsedId) ) return response.status(400).send({msg:'Bad Request. Invalid ID'});

    const searchUser = mockUsers.find( (user)=>user.id===parsedId );
    //Verificamos si no existe el usuario
    if( !searchUser ) return response.status(404).send({msg:'Not Found. User not found'});

    return response.status(200).send(searchUser);
});

finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});