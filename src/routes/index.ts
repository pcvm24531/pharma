import { Router } from "express";
import { readdirSync } from "fs";

const PATH_ROUTER = `${__dirname}`;//dirname retorna la ruta del directorio actual
const router = Router();

readdirSync( PATH_ROUTER ).filter( (fileName)=>{
    console.log(fileName);    
} );


export { router };