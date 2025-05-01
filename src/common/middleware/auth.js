import moment from "moment";
import passport from "passport";
import jwt from "jsonwebtoken";
import AccessToken from "../../../models/accessToken";
import { HttpStatus } from "../error-exception";
import User from "../../../models/user";
import { JWT } from "../constants/constant";

export default (req, res, next) => {
    passport.authenticate("jwt", { session: false }, async (err, user) => {
        if (!user) {
            return res
                .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
                .send({ message: "Unauthorized" });
        }

        const exist = await AccessToken.findOne({
            token: user.jti,
            isRevoked: false,
            userId: user.userId,
        });

        if (!exist) {
            return res
                .status(HttpStatus.UNAUTHORIZED_EXCEPTION)
                .send({ message: "Unauthorized" });
        }

        const lastLogin = await User.findOne({
            _id: user.userId,
            lastLoginAt: {
                $gte: new Date(moment().startOf("D")),
                $lt: new Date(moment().add(1, "d").startOf("D")),
            },
        });

        if (!lastLogin) {
            await User.updateOne(
                { _id: user.userId },
                {
                    lastLoginAt: new Date(),
                }
            );
        }

        req.user = user;
        return next();
    })(req, res, next);
};
