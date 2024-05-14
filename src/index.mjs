import express from "express";
import 'dotenv/config';
import {finAvailablePort} from '../port.js';
import { mongoose } from "mongoose";
import {mockUsers} from "./utils/constants.mjs"
import usersRouter from "./routes/users.mjs";

const app = express();

app.use(express.json);
app.use(usersRouter);

const desiredPort = process.env.PORT ?? 3000;
const DB_CONN = process.env.URI_DB;

mongoose.connect( DB_CONN)
    .then( ()=>console.log('DB Connected') )
    .catch( (err)=>console.log(`Error: ${err}`) );

finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});

const logginMiddleware = (request, response, next)=>{
    console.log(`${request.method} - ${request.url}`);
    next();
};

const resolveIndexByUserId = (request, response, next)=>{
    const {
        body,
        params:{id}
    } = request;
    const parseId = parseInt(id);
    if( isNaN(parseId) ) return response.status(400).send({msg:'Bad request. User id invalid'});
    const findUserIndex = mockUsers.findIndex( (user)=>user.id===parseId );
    if( findUserIndex === -1 ) return response.status(404).send({msg:'Not found'});
    request.findUserIndex = findUserIndex;
    next();
}
