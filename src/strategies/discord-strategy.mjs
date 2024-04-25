import passport from "passport";
import { Strategy } from "passport-discord";
import { DiscordUser } from "../mongoose/schemas/discord-user.mjs";

passport.serializeUser((user, done)=>{
    console.log(`Inside Serialize User`);
    console.log(user);
    done(null, user.id);
});

export default passport.use(
    new Strategy({
        clientID:'1185785809043996732',
        clientSecret:'lwSBX71hhRASCsBH2oz2bl5thWLk12eo',
        callbackURL: 'http://localhost:300/api/auth/discord/redirect',
        scope:['identify','guilds'],
    }, 
    async (accessToken, refresToken, profile, done)=>{
        let findUser;
        try {
            findUser = await DiscordUser.findOne({discordId: profile.id});
        } catch (error) {
            return done(error, null);
        }
        try {
            if(!findUser){
                const newUser = new DiscordUser({
                    username: profile.username,
                    discordId: profile.id
                });
                const newSavedUser = await newUser.save();
                return done(null, newSavedUser);
            }
            return done(null, newSavedUser)
        } catch (error) {
            console.log(`Error:${error}`);
            return done(error, null);
        }
    })
);
