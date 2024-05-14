import { Router } from "express";
import { checkSchema, matchedData, query, validationResult } from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";

const router = Router();

router.get(
    "/api/users",
    query("filter")
        .isString()
        .notEmpty()
        .withMessage("Must not be empty")
        .isLength({min:3, max:10})
        .withMessage("Must be at least 3-10 characters"),
    (request, response)=>{
        const result = validationResult(request);
        console.log(result);
        const{
            query: { filter, value }
        } = request;
        if (filter && value) return response.send(
            mockUsers.filter( (user) => user[filter].includes(value) )
        );
        return response.send(mockUsers);
    }    
);
router.post(
    "/api/users",
    checkSchema(createUserValidationSchema),
    (request, response)=>{
        const result = validationResult(request);

        if( !result.isEmpty() )
            return response.status(400).send({errors: result.array()});
        const data = matchedData(request);
        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
        mockUsers.push(newUser);
        return response.status(201).send(newUser);
    }
);

export default router;