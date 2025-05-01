import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { JWT } from "../constants/constant";
import passport from "passport";
import AccessToken from "../../../models/accessToken";

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT.SECRET,
};

passport.use(
    new JWTStrategy(options, async (jwtPayload, done) => {
        try {
            const user = await AccessToken.findOne({
                userId: jwtPayload.id,
                token: jwtPayload.jti,
            });

            if (!user) {
                return done(null, false);
            }

            return done(null, { ...user._doc, jti: jwtPayload.jti });
        } catch (error) {
            console.error(error);
            return done(error, false);
        }
    })
);
