import classesServices from "./classes.service";

class classesController {
    /**
     * @description: Get Classes List
     * @param {*} req
     * @param {*} res
     */
    static async getClasses(req, res) {
        const data = await classesServices.getClasses(req.query, req, res);
        return;
    }
}

export default classesController;
