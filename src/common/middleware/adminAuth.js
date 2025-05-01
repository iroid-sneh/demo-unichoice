import jwt from "jsonwebtoken";
import Admin from "../../../models/admin";
import commonService from "../../../utils/common.service";

export default async function (req, res, next) {
    if (req.session.token) {
        jwt.verify(
            req.session.token,
            process.env.JWT_SECRET,
            async (err, decode) => {
                if (err) {
                    return res.redirect("/admin/login");
                } else {
                    req.user = await Admin.findById(decode.id).select(
                        "-password"
                    );

                    // commonService.findById(Admin, {
                    //     id: decode.id,
                    // });
                    // .select("-password");

                    if (!req.user) {
                        return res.redirect("/admin/login");
                    }
                    next();
                }
            }
        );
    } else {
        return res.redirect("/admin/login");
    }
}
