import studySerivce from "./study.service";

class studyController {
    /**
     * @description: Study Materials colleges Page
     * @param {*} req
     * @param {*} res
     */
    static async studyPage(req, res) {
        const data = await studySerivce.studyPage(req, res);
        return;
    }

    /**
     * @description: Study Materials Colleges List
     * @param {*} req
     * @param {*} res
     */
    static async studyCollegeList(req, res) {
        const data = await studySerivce.studyCollegeList(req.query, req, res);
        return { data: data };
    }

    /**
     * @description: Add colleges Page
     * @param {*} req
     * @param {*} res
     */
    static async addCollegesPage(req, res) {
        const data = await studySerivce.addCollegesPage(req, res);
        return;
    }

    /**
     * @description: Add Colleges
     * @param {*} req
     * @param {*} res
     */
    static async addColleges(req, res) {
        const data = await studySerivce.addColleges(
            req.body,
            req.file,
            req,
            res
        );
    }

    /**
     * @description: update colleges Page
     * @param {*} req
     * @param {*} res
     */
    static async updateCollegesPage(req, res) {
        const data = await studySerivce.updateCollegesPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Update Colleges
     * @param {*} req
     * @param {*} res
     */
    static async updateColleges(req, res) {
        const data = await studySerivce.updateColleges(
            req.params.id,
            req.body,
            req.file,
            req,
            res
        );
        return;
    }

    /**
     * @description: Delete colleges
     * @param {*} req
     * @param {*} res
     */
    static async deleteColleges(req, res) {
        const data = await studySerivce.deleteColleges(req.params.id, req, res);
        return;
    }

    /**
     * @description: Materials Page
     * @param {*} req
     * @param {*} res
     */
    static async materialsPage(req, res) {
        const data = await studySerivce.materialsPage(req.params.id, req, res);
        return;
    }

    /**
     * @description: Materials list
     * @param {*} req
     * @param {*} res
     */
    static async materialsList(req, res) {
        const data = await studySerivce.materialsList(
            req.params.id,
            req.query,
            req,
            res
        );
        return;
    }

    /**
     * @description: Add Materials Page
     * @param {*} req
     * @param {*} res
     */
    static async addMaterialsPage(req, res) {
        const data = await studySerivce.addMaterialsPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Add Materials
     * @param {*} req
     * @param {*} res
     */
    static async addMaterials(req, res) {
        const data = await studySerivce.addMaterials(
            req.params.id,
            req.body,
            req,
            res
        );
        return;
    }

    /**
     * @description: Update Materials Page
     * @param {*} req
     * @param {*} res
     */
    static async updateMaterialsPage(req, res) {
        const data = await studySerivce.updateMaterialsPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: update Materials
     * @param {*} req
     * @param {*} res
     */
    static async updateMaterials(req, res) {
        const data = await studySerivce.updateMaterials(
            req.params.id,
            req.body,
            req,
            res
        );
        return;
    }

    /**
     * @description: Delete Materials
     * @param {*} req
     * @param {*} res
     */
    static async deleteMaterials(req, res) {
        const data = await studySerivce.deleteMaterials(req.params.id, req, res);
        return;
    }
}

export default studyController;
