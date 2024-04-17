import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";

passport.serializeUser( (user, done)=>{
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id)
});

passport.deserializeUser( (id, done)=>{
    console.log(`Inside Deserialize`);
    try {
        const findUser = mockUsers.find( (user)=>user.id===id);
        if(!findUser) throw new Error("User not found");
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
});

export default passport.use(
    new Strategy((username, password, done)=>{
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        try {
            const findUser = mockUsers.find( (user)=> user.username === username );
            if( !findUser ) throw new Error("User not found");
            if (findUser.password!==password) throw new Error("invalid credential");
            done(null, findUser);
        } catch (error) {
            done(error, null);
        }
    })
);