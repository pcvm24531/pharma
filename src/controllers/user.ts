import { Request, Response } from "express";
import { handleHttp } from "../utils/error.handle";

const getUser = (req:Request, res:Response)=>{
    try {
        
    } catch (error) {
        handleHttp(res, 'ERROR_GET_USER');
    }
}

const getUsers = (req:Request, res:Response)=>{
    try {
        
    } catch (error) {
        handleHttp(res, 'ERROR_GET_USERS');
    }
}

const addUser = (req:Request, res:Response)=>{
    try {
        const {body} = req;
        console.log(req.params);        
        res.status(200).send(body);
    } catch (error) {
        handleHttp(res, 'ERROR_ADD_USER');
    }
}

const editUser = (req:Request, res:Response)=>{
    try {
        
    } catch (error) {
        handleHttp(res, 'ERROR_EDIT_USER');
    }
}

const deleteUser = (req:Request, res:Response)=>{
    try {
        
    } catch (error) {
        handleHttp(res, 'ERROR_DELETE_USER');
    }
}

export {getUser, getUsers, addUser, editUser, deleteUser}