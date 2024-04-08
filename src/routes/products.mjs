import { Router } from "express";
import { query, validationResult, checkSchema } from "express-validator";
import { mockProducts } from "../utils/constants.mjs";

const router = Router();

router.get(
    '/api/products',
    ( req, res )=>{
        return res.status(200);send(mockProducts);
    }
);

export default router;