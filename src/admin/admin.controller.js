import adminService from "./admin.service";

class adminController {
    /**
     * @description: Admin Login Page
     * @param {*} req
     * @param {*} res
     */
    static async loginPage(req, res) {
        const data = await adminService.loginPage(req, res);
        return;
    }

    /**
     * @description: Admin Login
     * @param {*} req
     * @param {*} res
     */
    static async login(req, res) {
        const data = await adminService.login(req.body, req, res);
        return;
    }

    /**
     * @description: Admin Dashboard Page
     * @param {*} req
     * @param {*} res
     */
    static async dashboard(req, res) {
        const data = await adminService.dashboard(req, res);
        return;
    }

    /**
     * @description: Admin Change Password Page
     * @param {*} req
     * @param {*} res
     */
    static async changePasswordPage(req, res) {
        const data = await adminService.changePasswordPage(req, res);
        return;
    }

    /**
     * @description: Admin Login
     * @param {*} req
     * @param {*} res
     */
    static async changePassword(req, res) {
        const data = await adminService.changePassword(req.body, req, res);
        return;
    }

    /**
     * @description: Logout
     * @param {*} req
     * @param {*} res
     */
    static async logout(req, res) {
        const data = await adminService.logout(req, res);
        return;
    }
}

export default adminController;
