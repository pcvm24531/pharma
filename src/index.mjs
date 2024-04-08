import express from "express";
import {finAvailablePort} from '../port.js';
import routes from "./routes/index.mjs";

const app = express();

app.use(express.json());
app.use(routes);

const logginMiddleware = (request, response, next)=>{
    console.log(`${request.method} - ${request.url}`);
    next();
}

const desiredPort = process.env.PORT ?? 3000;



finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});