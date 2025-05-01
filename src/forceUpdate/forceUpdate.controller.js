import forceUpdateServices from "./forceUpdate.service";

class forceUpdateController {
    /**
     * @description: Force Update
     * @param {*} req
     * @param {*} res
     */
    static async forceUpdate(req, res) {
        const data = await forceUpdateServices.forceUpdate(req.boy, req, res);
        return;
    }
}

export default forceUpdateController;
