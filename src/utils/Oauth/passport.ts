import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import dotenv from "dotenv"
import userModel from "../../models/user"
dotenv.config()

const clientId = process.env.CLIENT_ID ?? ""
const clientSecret = process.env.CLIENT_SECRET ?? ""

const getProfile = (profile: any) => {
    const { id, displayName, emails, provider, name } = profile;
    if (emails?.length) {
        const email = emails[0].value;
        return {
            googleId: id,
            name: displayName,
            email,
            username: name.givenName,
            provider,
        };
    }
    return null;
};

passport.use(
    new GoogleStrategy({
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: "https://scissors-kl37.onrender.com/oauth/auth/google/redirect"
    },
        async (accessToken: string, refreshToken: string, profile: any, done: any) => {
            try {
                const existingGoogleAccount = await userModel.findOne({ googleId: profile.id });

                if (!existingGoogleAccount) {
                    const existingEmailAccount = await userModel.findOne({ email: getProfile(profile)?.email });

                    if (!existingEmailAccount) {
                        const newAccount = await userModel.create(getProfile(profile));
                        return done(null, newAccount);
                    }
                    return done(null, existingEmailAccount);
                }
                return done(null, existingGoogleAccount);
            } catch (error: any) {
                throw new Error(error);
            }
        }
    )
)

passport.serializeUser((user: any, done) => {
    done(null, user?._id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((error) => done(error));
});