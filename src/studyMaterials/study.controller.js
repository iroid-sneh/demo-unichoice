import studyServices from "./study.service";

class studyController {
    /**
     * @description: Colleges List with Materials
     * @param {*} req
     * @param {*} res
     */
    static async collegeList(req, res) {
        const data = await studyServices.collegeList(req.query, req, res);
        return;
    }

    /**
     * @description: Get Study materials of the Colleges
     * @param {*} req
     * @param {*} res
     */
    static async getMaterials(req, res) {
        const data = await studyServices.getMaterials(
            req.params.id,
            req.query,
            req,
            res
        );
    }
}

export default studyController;
