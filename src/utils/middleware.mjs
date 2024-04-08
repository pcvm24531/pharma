import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (request, response, next)=>{
    const {
        params:{id}
    }=request;
    const parsedId = parseInt(id);
    if( isNaN(parsedId) ) return response.status(400).send({msg:"Bad Request. Invalid ID"})
    const findUserIndex = mockUsers.findIndex( (user)=>user.id===parsedId );
    if( findUserIndex === -1 ) return response.status(404).send({msg:'Not Found'})
    request.findUserIndex = findUserIndex;
    next();
}

export const resolveProductByIndexId = (request, response, next)=>{
    const {
        params:{id}
    } = request;
};