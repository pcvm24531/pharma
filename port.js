//Buscar puertos disponibles
//Al igual que el protocolo http, se tiene el modulo net, es mas liviano y permite hacer conexiones mas rapidas
const net = require('node:net');

function finAvailablePort(desiredPort) {
    return new Promise((resolve, rejet)=>{
        const server = net.createServer();

        server.listen(desiredPort, ()=>{
            const { port } = server.address();
            server.close( ()=>{
                resolve(port);
            } );
        });

        server.on('error', (err)=>{
            if(err.code==='EADDRINUSE'){
                finAvailablePort( 0 ).then( port => resolve(port) );
            }else{
                rejet(err)
            }
        })
    })
}

module.exports = { finAvailablePort }