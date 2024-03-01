import { Router } from "express";
import { readdirSync } from "fs";

const PATH_ROUTER = `${__dirname}`;//dirname retorna la ruta del directorio actual
const router = Router();

//Limpiamos la extension del archivo
const cleanFileName = ( fileName: string )=>{
    const file = fileName.split(".").shift();
    return file;
};

readdirSync( PATH_ROUTER ).filter( (fileName)=>{
    const cleanName = cleanFileName( fileName );
    if( cleanName !== 'index' ){
        import(`./${cleanName}`)
            .then( (moduleRouter)=>{
                console.log(`El modulo importado es ${cleanName}....`);
                router.use(`/${cleanName}`, moduleRouter.router);
            } );
    }
} );


export { router };