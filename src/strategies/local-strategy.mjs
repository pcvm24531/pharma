import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../mongoose/schemas/users.mjs";

passport.serializeUser( (user, done)=>{
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id)
});

passport.deserializeUser(async (id, done)=>{
    console.log(`Inside Deserialize`);
    try {
        const findUser = await User.findById(id);
        if(!findUser) throw new Error("User not found");
        done(null, findUser);
    } catch (error) {
        done(error, null);
    }
});

export default passport.use(
    new Strategy(async(username, password, done)=>{
        console.log(`Username: ${username}`);
        console.log(`Password: ${password}`);
        try {
            const findUser = await User.findOne({username});console.log(findUser);
            if( !findUser ) throw new Error("User not found");
            if(findUser.password != password) throw new Error ("Bad credentials");
            done(null, findUser);
        } catch (error) {
            done(error, null);
        }
    })
);