import express from "express";
import {finAvailablePort} from '../port.js';
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(routes);

const logginMiddleware = (request, response, next)=>{
    console.log(`${request.method} - ${request.url}`);
    next();
}

const desiredPort = process.env.PORT ?? 3000;

app.get('/', (req, res)=>{
    res.cookie("hello", "world", {maxAge:10000});
    res.status(201).send({msg:"Hi"});
});

finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});