import { Router } from "express";

const router = Router();

router.get( '/users', (request, response)=>{
    response.status(404).send( {data: 'Aqui van los modelos'} );    
} );


export { router };