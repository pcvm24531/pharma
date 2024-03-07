import { Router } from "express";
import { addUser, deleteUser, editUser, getUser, getUsers } from "../controllers/user";

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', addUser);
router.put('/:id', editUser);
router.delete('/:id', deleteUser);


export { router };