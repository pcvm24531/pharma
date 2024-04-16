import { Router } from "express";
import { query, validationResult, checkSchema } from "express-validator";
import { mockProducts } from "../utils/constants.mjs";

const router = Router();

router.get(
    '/api/products',
    ( req, res )=>{
        if( req.signedCookies.hello && req.signedCookies.hello==='world' ){
            return res.status(200).send(mockProducts);
        }
        return res.status(403).send({msg:'Sorry. You need the correct cookie!'})
    }
);

export default router;