import classesService from "./classes.service";

class classesController {
    /**
     * @description: Classes Page
     * @param {*} req
     * @param {*} res
     */
    static async classesPage(req, res) {
        const data = await classesService.classesPage(req, res);
        return;
    }

    /**
     * @description: Classes list
     * @param {*} req
     * @param {*} res
     */
    static async classesList(req, res) {
        const data = await classesService.classesList(req.query, req, res);
        return { data: data };
    }

    /**
     * @description: Add Classes Page
     * @param {*} req
     * @param {*} res
     */
    static async addClassesPage(req, res) {
        const data = await classesService.addClassesPage(req, res);
        return;
    }

    /**
     * @description: Add Classes
     * @param {*} req
     * @param {*} res
     */
    static async addClasses(req, res) {
        const data = await classesService.addClasses(
            req.body,
            req.file,
            req,
            res
        );
        return;
    }

    /**
     * @description: Update Classes Page
     * @param {*} req
     * @param {*} res
     */
    static async updateClassPage(req, res) {
        const data = await classesService.updateClassPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Update Classes
     * @param {*} req
     * @param {*} res
     */
    static async updateClasses(req, res) {
        const data = await classesService.updateClasses(
            req.params.id,
            req.body,
            req.file,
            req,
            res
        );
        return;
    }

    /**
     * @description: Delete Classes by id
     * @param {*} req
     * @param {*} res
     */
    static async deleteClasses(req, res) {
        const data = await classesService.deleteClasses(
            req.params.id,
            req,
            res
        );
        return;
    }
}

export default classesController;
