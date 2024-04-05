import { Router } from "express";
import { query, validationResult, checkSchema } from "express-validator";
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
 
const router = Router();

router.get(
    '/api/users',
    query('filter')
        .isString()
        .notEmpty().withMessage('Must not be empty')
        .isLength({min:2, max:20}).withMessage('Must be at least 3-10 characters')
    ,
    (request, response)=>{
        
        const result = validationResult(request);
        console.log(result);

        const {query:{filter, value}} = request;
        //Si el filtro y valor no han sido definidos
        if( !filter && !value ) return response.status(200).send(mockUsers);

        if( filter && value ) 
            return response.send(
                mockUsers.filter( (user)=> user[filter].includes(value) )
            );
        
        return response.send(mockUsers);
    }
);

router.post(
    '/api/users', 
    checkSchema(createUserValidationSchema),
    (request, response)=>{
        const result = validationResult(request);

        if( !result.isEmpty ) return response.status(400).send({error: result.array()})

        const {body} = request;
        
        const newUser = { id: mockUsers[mockUsers.length-1].id+1 , ...body  }
        mockUsers.push(newUser);
        return response.status(200).send(mockUsers);
    }
);

export default router;