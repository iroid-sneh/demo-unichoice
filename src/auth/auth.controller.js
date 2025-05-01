import authServices from "./auth.service";

class authController {
    /**
     * @description: Login for Users
     * @param {*} req
     * @param {*} res
     */
    static async login(req, res) {
        const data = await authServices.login(req.body, req, res);
        return;
    }

    /**
     * @description: Verify Email with OTP
     * @param {*} req
     * @param {*} res
     */
    static async verifyEmail(req, res) {
        const data = await authServices.verifyEmail(req.body, req, res);
        return;
    }

    /**
     * @description: Resend OTP
     * @param {*} req
     * @param {*} res
     */
    static async resendOtp(req, res) {
        const data = await authServices.resendOtp(req.body, req, res);
        return;
    }

    /**
     * @description: Complete Profile
     * @param {*} req
     * @param {*} res
     */
    static async profile(req, res) {
        const data = await authServices.profile(req.body, req, res);
        return;
    }

    /**
     * @description: User Account Details
     * @param {*} req
     * @param {*} res
     */
    static async accountDetails(req, res) {
        const data = await authServices.accountDetails(req, res);
        return;
    }

    /**
     * @description: Logout Users
     * @param {*} req
     * @param {*} res
     */
    static async logout(req, res) {
        const data = await authServices.logout(req, res);
        return;
    }

    /**
     * @description: Delete User Account
     * @param {*} req
     * @param {*} res
     */
    static async deleteAccount(req, res) {
        const data = await authServices.deleteAccount(req, res);
        return;
    }
}

export default authController;
