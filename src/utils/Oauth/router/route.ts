import { passportController } from "../controller";
import passport from "passport";
import { Router } from "express";


const passportRouter = Router()

// passportRouter.get("/oauth-google", passport.authenticate("google", { scope: ["profile", "email"] }, passportController.googleLogin))
passportRouter.get('/login/google', passport.authenticate('google', { scope: ["profile", "email"] }, passportController.googleLogin));

passportRouter.get('/auth/google/redirect',
    passport.authenticate('google'), passportController.googleLogin);

export default passportRouter