import { Router } from "express";

const router = Router();

router.get('/', (request, response)=>{
    return response.send({data:'This is items'});
});

export {router};