import { Router } from "express";
import { query, validationResult, checkSchema, matchedData } from "express-validator";
import { mockUsers } from '../utils/constants.mjs';
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../utils/middleware.mjs";
import { User } from "../mongoose/schemas/users.mjs";

const router = Router();

router.get(
    '/api/users',
    query('filter')
        .isString()
        .notEmpty().withMessage('Must not be empty')
        .isLength({min:2, max:20}).withMessage('Must be at least 3-10 characters')
    ,
    (request, response)=>{
        console.log(request.session.id);
        request.sessionStore.get(request.session.id, (err, sessionData)=>{
            if( err ){
                console.log(err);
                throw err;
            }
            console.log(sessionData);
        });
        const result = validationResult(request);

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

router.get('/api/users/:id',resolveIndexByUserId ,(request, response)=>{
    const {findUserIndex}=request;
    const findUser = mockUsers[findUserIndex];
    if(!findUser) return response.status(404);
    return response.status(200).send(findUser);
});

router.post(
    '/api/users', 
    checkSchema(createUserValidationSchema),
    async (request, response)=>{
        const result = validationResult(request);

        if( !result.isEmpty ) return response.status(400).send({error: result.array()})

        const data = matchedData(request);
        const newUser = new User(data);
        try {
            const savedUser = await newUser.save();
            return response.status(201).send(savedUser);
        } catch (error) {
            console.log(error);
            return response.sendStatus(400);
        }
    }
);

//Ejemplo actualizar informacion
router.put('/api/users/:id', resolveIndexByUserId, (request, response)=>{
    const {body, findUserIndex}=request;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return response.status(200).send(mockUsers);
} );

//Ejemplo usamos patch para agregar un nuevo campo/atributo/etc
router.patch("/api/users/:id",resolveIndexByUserId ,(request, response)=>{
    const {body,findUserIndex} = request;  
    mockUsers[findUserIndex] = {...mockUsers[findUserIndex], ...body};
    return response.status(200).send(mockUsers);
} );

router.delete("/api/users/:id",resolveIndexByUserId ,(request, response)=>{
    const {findUserIndex}=request;
    mockUsers.splice(findUserIndex, 1);
    return response.status(200).send(mockUsers);
});

export default router;