import express from "express";
import {finAvailablePort} from '../port.js';
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import {mockUsers} from "./utils/constants.mjs";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(session(
    {
        secret: "pcvm the dev",
        saveUninitialized: false,
        resave: false,
        cookie:{
            maxAge: 60000 * 60,
        }
    }
));
app.use(routes);

const logginMiddleware = (request, response, next)=>{
    console.log(`${request.method} - ${request.url}`);
    next();
}

const desiredPort = process.env.PORT ?? 3000;

app.get('/', (req, res)=>{
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
});

finAvailablePort(desiredPort).then( port =>{
    app.listen( port, ()=> {
        console.log( `Server listening on port http://localhost:${port}` );
    })
});