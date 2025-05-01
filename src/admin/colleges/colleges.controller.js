import collegeServices from "./colleges.service";

class collegeController {
    /**
     * @description: Colleges Page
     * @param {*} req
     * @param {*} res
     */
    static async collegesPage(req, res) {
        const data = await collegeServices.collegesPage(req, res);
        return;
    }

    /**
     * @description: Colleges List
     * @param {*} req
     * @param {*} res
     */
    static async collegeList(req, res) {
        const data = await collegeServices.collegeList(req.query, req, res);
        return;
    }

    /**
     * @description: Add Colleges Page
     * @param {*} req
     * @param {*} res
     */
    static async addCollegesPage(req, res) {
        const data = await collegeServices.addCollegesPage(req, res);
        return;
    }

    /**
     * @description: Add Colleges
     * @param {*} req
     * @param {*} res
     */
    static async addColleges(req, res) {
        const data = await collegeServices.addColleges(
            req.body,
            req.file,
            req,
            res
        );
        return;
    }

    /**
     * @description: Colleges Index Check
     * @param {*} req
     * @param {*} res
     */
    static async checkCollegesIndex(req, res) {
        const data = await collegeServices.checkCollegesIndex(req, res);
        return;
    }

    /**
     * @description: Delete Colleges
     * @param {*} req
     * @param {*} res
     */
    static async deleteColleges(req, res) {
        const data = await collegeServices.deleteColleges(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Update Colleges Page
     * @param {*} req
     * @param {*} res
     */
    static async updateCollegesPage(req, res) {
        const data = await collegeServices.updateCollegesPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Update College
     * @param {*} req
     * @param {*} res
     */
    static async updateColleges(req, res) {
        const data = await collegeServices.updateColleges(
            req.params.id,
            req.body,
            req.file,
            req,
            res
        );
        return;
    }

    /**
     * @description: View Updates Images and Videos
     * @param {*} req
     * @param {*} res
     */
    static async viewUpdatesImages(req, res) {
        const data = await collegeServices.viewUpdatesImages(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: College Updates Page
     * @param {*} req
     * @param {*} res
     */
    static async collegeUpdates(req, res) {
        const data = await collegeServices.collegeUpdates(
            req.params.id,
            req,
            res
        );
    }

    /**
     * @description: College Updates List
     * @param {*} req
     * @param {*} res
     */
    static async collegeUpdatesList(req, res) {
        const data = await collegeServices.collegeUpdatesList(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Add Updates Page For College
     * @param {*} req
     * @param {*} res
     */
    static async addUpdatesPage(req, res) {
        const data = await collegeServices.addUpdatesPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Add Updates For Colleges
     * @param {*} req
     * @param {*} res
     */
    static async addUpdates(req, res) {
        const data = await collegeServices.addUpdates(
            req.params.id,
            req.body,
            req,
            res
        );
        return;
    }

    /**
     * @description: College Updates Edit Page
     * @param {*} req
     * @param {*} res
     */
    static async editUpdatesPage(req, res) {
        const data = await collegeServices.editUpdatesPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Edit College Updates
     * @param {*} req
     * @param {*} res
     */
    static async editUpdates(req, res) {
        const data = await collegeServices.editUpdates(
            req.params.id,
            req.body,
            req,
            res
        );
        return;
    }

    /**
     * @description: Delete Images of College Updates
     * @param {*} req
     * @param {*} res
     */
    static async deleteImage(req, res) {
        const data = await collegeServices.deleteImage(req.params.id, req, res);
        return;
    }

    /**
     * @description: Delete Updates
     * @param {*} req
     * @param {*} res
     */
    static async deleteUpdates(req, res) {
        const data = await collegeServices.deleteUpdates(
            req.params.id,
            req,
            res
        );
        return;
    }
}

export default collegeController;
