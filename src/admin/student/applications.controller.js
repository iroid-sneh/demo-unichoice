import applicationsServices from "./applications.service";

class applicationsController {
    /**
     * @description: Students List Page
     * @param {*} req
     * @param {*} res
     */
    static async applicationPage(req, res) {
        const data = await applicationsServices.applicationPage(req, res);
        return;
    }

    /**
     * @description: Studets List
     * @param {*} req
     * @param {*} res
     */
    static async collegeList(req, res) {
        const data = await applicationsServices.collegeList(
            req.query,
            req,
            res
        );
        return;
    }

    /**
     * @description: Students List By College Id
     * @param {*} req
     * @param {*} res
     */
    static async studentsListPage(req, res) {
        const data = await applicationsServices.studentsListPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: STudents List
     * @param {*} req
     * @param {*} res
     */
    static async studentsList(req, res) {
        const data = await applicationsServices.studentsList(
            req.params.id,
            req,
            res
        );
        return;
    }
}

export default applicationsController;
