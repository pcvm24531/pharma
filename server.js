const http = require('node:http');
const mongoose = require('mongoose');
const {finAvailablePort} = require('./port');
const { log, Console } = require('node:console');

const desiredPort = process.env.PORT ?? 3000 ;

const server = http.createServer(
    ( req, res )=>{
        res.end('Hola mundo cruel');
    }
);

mongoose.connect("mongodb+srv://root:Abcde123@cluster0.ymmzdlc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then( ()=>console.log('Conectado MongoDB') );

finAvailablePort(desiredPort).then( port =>{
    server.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${server.address().port}` );
    })
});