import updatesServices from "./updates.service";
class updatesController {
    /**
     * @description: Get Colleges Updates
     * @param {*} req
     * @param {*} res
     */
    static async getUpdates(req, res) {
        const data = await updatesServices.getUpdates(req, res);
        return;
    }

    /**
     * @description: Get Tags List for Updates
     * @param {*} req
     * @param {*} res
     */
    static async tags(req, res) {
        const data = await updatesServices.tags(req, res);
        return;
    }

    /**
     * @description: Updates list of colleges
     * @param {*} req
     * @param {*} res
     */
    static async collegeUpdatesList(req, res) {
        const data = await updatesServices.collegeUpdatesList(
            req.params.id,
            req,
            res
        );
        return;
    }
}

export default updatesController;
