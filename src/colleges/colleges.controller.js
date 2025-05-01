import collegesService from "./colleges.service";

class collegesController {
    /**
     * @description: Colleges List
     * @param {*} req
     * @param {*} res
     */
    static async collegesList(req, res) {
        const data = await collegesService.collegesList(req.query, req, res);
        return;
    }

    /**
     * @description: Apply To Colleges
     * @param {*} req
     * @param {*} res
     */
    static async applyToColleges(req, res) {
        const data = await collegesService.applyToColleges(req.body, req, res);
        return;
    }

    /**
     * @description: Add Colleges to Interested
     * @param {*} req
     * @param {*} res
     */
    static async interested(req, res) {
        const data = await collegesService.interested(req.body, req, res);
        return;
    }

    /**
     * @description: User Preference List of Stream|State Colleges
     * @param {*} req
     * @param {*} res
     */
    static async preferenceList(req, res) {
        const data = await collegesService.preferenceList(req, res);
        return;
    }

    /**
     * @description:  College Rank Page
     * @param {*} req
     * @param {*} res
     */
    static async rank(req, res) {
        const data = await collegesService.rank(req.query, req, res);
        return;
    }

    /**
     * @description: Rank Options List
     * @param {*} req
     * @param {*} res
     */
    static async rankOptions(req, res) {
        const data = await collegesService.rankOptions(req, res);
        return;
    }
}

export default collegesController;
