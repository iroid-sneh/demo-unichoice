import Admin from "../../models/admin";
import commonService from "../../utils/common.service";
import authHelper from "../common/auth.helper";
import jwt from "jsonwebtoken";
import { matchHashedPassword } from "../common/auth.helper";
import flash from "connect-flash";
import { BCRYPT, JWT } from "../common/constants/constant";

class adminService {
    /**
     * @description: Admin Login Page
     * @param  {*} req
     * @param  {*} res
     */
    static async loginPage(req, res) {
        return res.render("admin/login");
    }

    /**
     * @description: Admin Login
     * @param {*}  data
     * @param {*}  req
     * @param {*}  res
     */
    static async login(data, req, res) {
        const { email, password } = data;

        const findAdmin = await commonService.findOne(Admin, { email: email });

        if (!findAdmin) {
            req.flash("error", "Invalid Email");
            return res.redirect("back");
        }

        const matchPassword = await authHelper.matchHashedPassword(
            password,
            findAdmin.password
        );

        if (!matchPassword) {
            req.flash("error", "Wrong Credentials");
            return res.redirect("back");
        }

        const payload = {
            id: findAdmin._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1 YEAR",
        });
        req.session.token = token;

        return res.redirect("/admin/dashboard");
        // return res.render("dashboard");
    }

    /**
     * @description: Admin Dashboard Page
     * @param  {*} req
     * @param  {*} res
     */
    static async dashboard(req, res) {
        return res.render("dashboard");
    }

    /**
     * @description: Admin Change Password Page
     * @param  {*} req
     * @param  {*} res
     */
    static async changePasswordPage(req, res) {
        return res.render("admin/change");
    }

    /**
     * @description: Admin Change Password
     * @param  {*} data
     * @param  {*} req
     * @param  {*} res
     */
    static async changePassword(data, req, res) {
        const { currentPassword, newPassword, confirmPassword } = data;

        const decodeJwt = jwt.verify(req.session.token, process.env.JWT_SECRET);

        if (decodeJwt) {
            const userId = await commonService.findById(Admin, {
                _id: decodeJwt.id,
            });

            const matchPassword = await authHelper.matchHashedPassword(
                currentPassword,
                userId.password
            );

            if (!matchPassword) {
                req.flash("error", "Current Password is incorrect");
                return res.redirect("back");
            }

            const hashedPassword = await authHelper.bcryptPassword(newPassword);

            await commonService.updateById(
                Admin,
                { _id: userId.id },
                {
                    password: hashedPassword,
                }
            );
            return res.redirect("/admin/logout");
        } else {
            req.flash("error", "Something Went Wrong");
        }
    }

    /**
     * @description: Logout
     * @param {*} req
     * @param {*} res
     */
    static async logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                return res.redirect("admin/dashboard");
            }
            res.clearCookie("connect.sid");
            res.redirect("/admin/login");
        });
    }
}

export default adminService;
