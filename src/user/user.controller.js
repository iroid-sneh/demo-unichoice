import userServices from "./user.service";

class userController {
    /**
     * @description: Terms And Conditions for the Users
     * @param {*} req
     * @param {*} res
     */
    static async termsAndConditions(req, res) {
        const data = await userServices.termsAndConditions(req, res);
        return;
    }
}

export default userController;
