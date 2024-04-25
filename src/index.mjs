import express from "express";
import {finAvailablePort} from '../port.js';
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
//import "./strategies/local-strategy.mjs";
import "./strategies/discord-strategy.mjs";


const app = express();

mongoose
.connect('mongodb://localhost:27017/pharma')
.then(()=>console.log('ConectedDB'))
.catch((err)=>console.log('Err:'+err));

app.use(express.json());
app.use(cookieParser());
app.use(
    session(
    {
        secret: "pcvm the dev",
        saveUninitialized: false,
        resave: false,
        cookie:{
            maxAge: 60000 * 60,
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient()
        })
    })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.post(
    '/api/auth', 
    passport.authenticate("local"), 
    (request, response)=>{
        response.sendStatus(200);
    }
);

app.get(
    '/api/auth/status',
    (request, response)=>{
        console.log(`Inside /api/auth/status`);
        console.log(request.user);
        console.log(request.session);
        console.log(request.sessionID);
        return  request.user ? response.status(200).send(request.user) : response.status(401).send({msg:'User not found'});
    }
);

app.post('/api/auth/logout', (request, response)=>{
    if(!request.user) return response.sendStatus(401);
    request.logout( (error)=>{
        if(error) return response.sendStatus(400);
        response.send(200);
    } );
});

app.get(
    '/api/auth/discord', 
    passport.authenticate("discord")
);
app.get(
    '/api/auth/discord/redirect', 
    passport.authenticate("discord"), 
    (request, response)=>{
        console.log(request.session);
        console.log(request.user);
        return response.sendStatus(200);
    }
);

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