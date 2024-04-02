const express = require('express');
const {finAvailablePort} = require('./port');

const app = express();
app.use(express.json());

const desiredPort = process.env.PORT ?? 3000 ;

const mockUsers = [
    {id:1, name:'Pablo', lastName:'Vargas'},
    {id:2, name:'Hugo', lastName:'Lopez'},
    {id:3, name:'Marco', lastName:'Mora'},
];

/*app.get('/api/users',(require, response)=>{
    response.status(201).send( mockUsers );
});*/
//Ejemplo get user con query => filter, value
app.get('/api/users', (request, response)=>{
    const {query:{filter, value}} = request;
    //Si el filtro y valor no han sido definidos
    if( !filter && !value ) return response.status(200).send(mockUsers);

    if( filter && value ) 
        return response.send(
            mockUsers.filter( (user)=> user[filter].includes(value) )
        );
    
    return response.send(mockUsers);
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

//Ejemplo Save Users
app.post('/api/users', (request, response)=>{
    const {body} = request;
    
    const newUser = { id: mockUsers[mockUsers.length-1].id+1 , ...body  }
    mockUsers.push(newUser);
    return response.status(200).send(mockUsers);
});

//Ejemplo actualizar informacion
app.put('/api/users/:id', (request, response)=>{
    const {body, params:{id}}=request;
    const parsedId = parseInt(id);
    if( isNaN(parsedId) ) return response.status(400).send({msg:"Bad Request"});

    const findUserByIndex = mockUsers.findIndex( (user)=>user.id===parsedId );
    if (findUserByIndex===-1) return response.status(404).send({msg:"Not Found."});

    mockUsers[findUserByIndex] = { id: parsedId, ...body };
     return response.status(200).send(mockUsers);
} );

//Ejemplo usamos patch para agregar un nuevo campo/atributo/etc
app.patch("/api/users/:id", (request, response)=>{
    const {
        body,
        params:{id}
    } = request;
    const parsedId = parseInt(id);

    if( isNaN(parsedId) ) return response.status(400).send({msg:'Bad Request'});

    const findUserIndexById = mockUsers.findIndex( (user)=>user.id===parsedId );
    if(findUserIndexById===-1)return response.status(404).send('Not Found');
    mockUsers[findUserIndexById] = {...mockUsers[findUserIndexById], ...body};
    return response.status(200).send(mockUsers);
} );

app.delete("/api/users/:id", (request, response)=>{
    const {params:{id}}=request;

    const parsedId = parseInt(id);

    if(isNaN(parsedId)) return response.status(400).send({msg:"Bad Request"});
    const findUserIndexById = mockUsers.findIndex( (user)=> user.id===parsedId );
    if( findUserIndexById === -1 ) return response.status(404).send({meg:'Not Found'});

    mockUsers.splice(findUserIndexById, 1);
    return response.status(200).send(mockUsers);
});



finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});