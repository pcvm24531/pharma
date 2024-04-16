import express from "express";
import {finAvailablePort} from '../port.js';
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import { mongoose } from "mongoose";
import "./strategies/local-strategy.mjs";

const app = express();

mongoose
.connect('mongodb://localhost:27017/pharma')
.then(console.log('Conectado MongoDB'))
.catch( (err)=>console.log(`Error: ${err}`) );

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
            }
        }
    )
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
        return  request.user ? response.status(200).send(request.user) : response.status(401).send({msg:'User not found'});
    }
);

app.post('/api/auth/logout', (request, response)=>{
    if(!request.user) return response.sendStatus(401);

    request.logout( (error)=>{
        if(error) return response.sendStatus(400);

        response.send(200);
    } );
})

const logginMiddleware = (request, response, next)=>{
    console.log(`${request.method} - ${request.url}`);
    next();
}

const desiredPort = process.env.PORT ?? 3000;

/*app.get('/', (req, res)=>{
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("hello", "world", {maxAge:10000});
    res.status(201).send({msg:"Hi"});
});

app.post('/api/auth', (request, response)=>{
    const { body: {username, password}, } = request;
    const findUser = mockUsers.find( (user) => user.username===username );
    if ( !findUser || findUser.password !== password ) return response.status(401).send({msg:'Bad Credential'});

    request.session.user = findUser;
    return response.status(200).send(findUser);
});

app.get('/api/auth/status', (request, response)=>{
    request.sessionStore.get(request.sessionID, (err, session)=>{
        console.log(session);
    });
    return request.session.user 
    ? response.status(200).send(request.session.user) 
    : response.status(401).send({msg:'Not Authenticated'});
})

app.post('/api/cart', (request, response)=>{
    if( !request.session.user ) return response.sendStatus(401);
    const { body: item } = request;
    const { cart } = request.session;
    if( cart ){
        cart.push(item);
    }else{
        request.session.cart = [item];
    }
    return response.status(200).send(item);
});
app.get('/api/cart/', (request, response)=>{
    if( !request.session.user ) return response.sendStatus(401);

    return response.status(200).send( request.session.cart ?? [] );
});*/

finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});