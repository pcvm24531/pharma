import { Router } from "express";
import { getItems } from "../controllers/item";

const router = Router();

router.get('/', getItems);
//router.get('/:id', getItem);
//router.post('/', addItem);
//router.put('/:id', editItem);
//router.delete('/:id', deleteItem);

export {router};