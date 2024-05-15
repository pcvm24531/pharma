import { mockUsers } from "./constants.mjs";

export const resolveIndexByUserId = (request, response, next)=>{
    const {
        body,
        params:{id}
    } = request;
    const parseId = parseInt(id);
    if( isNaN(parseId) ) return response.status(400).send({msg:'Bad request. User id invalid'});
    const findUserIndex = mockUsers.findIndex( (user)=>user.id===parseId );
    if( findUserIndex === -1 ) return response.status(404).send({msg:'Not found'});
    request.findUserIndex = findUserIndex;
    next();
}

export const resolveProductByIndexId = (request, response, next)=>{
    const {
        params:{id}
    } = request;
};