import updatesService from "./update.service";

class updateController {
    /**
     * @description: Updates page
     * @param {*} req
     * @param {*} res
     */
    static async TagPage(req, res) {
        const data = await updatesService.TagPage(req, res);
        return;
    }

    /**
     * @description: Tag List
     * @param {*} req
     * @param {*} res
     */
    static async tagList(req, res) {
        const data = await updatesService.tagList(req.query, req, res);
    }

    /**
     * @description: Add Tag
     * @param {*} req
     * @param {*} res
     */
    static async addTag(req, res) {
        const data = await updatesService.addTag(req.body, req, res);
        return { data };
    }

    /**
     * @description: Update Tag
     * @param {*} req
     * @param {*} res
     */
    static async updateTag(req, res) {
        const data = await updatesService.updateTag(
            req.params.id,
            req.body,
            req,
            res
        );
        return { data };
    }

    /**
     * @description: Delete Tag
     * @param {*} req
     * @param {*} res
     */
    static async deleteTag(req, res) {
        const data = await updatesService.deleteTag(req.params.id, req, res);
        return { data };
    }

    /**
     * @description: Updates for Tag Page
     * @param {*} req
     * @param {*} res
     */
    static async TagUpdatesPage(req, res) {
        const data = await updatesService.TagUpdatesPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Tag Updates List
     * @param {*} req
     * @param {*} res
     */
    static async tagUpdatesList(req, res) {
        const data = await updatesService.tagUpdatesList(
            req.params.id,
            req,
            res
        );
    }

    /**
     * @description: Add Updates Page
     * @param {*} req
     * @param {*} res
     */
    static async addUpdatesPage(req, res) {
        const data = await updatesService.addUpdatesPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Add Updates
     * @param {*} req
     * @param {*} res
     */
    static async addUpdates(req, res) {
        const data = await updatesService.addUpdates(
            req.params.id,
            req.body,
            req,
            res
        );
        return;
    }

    /**
     * @description: Edit Updates Page
     * @param {*} req
     * @param {*} res
     */
    static async editUpdatesPage(req, res) {
        const data = await updatesService.editUpdatesPage(
            req.params.id,
            req,
            res
        );
        return;
    }

    /**
     * @description: Edit Update
     * @param {*} req
     * @param {*} res
     */
    static async editUpdates(req, res) {
        const data = await updatesService.editUpdates(
            req.params.id,
            req.body,
            req,
            res
        );
        return;
    }

    /**
     * @description: Delete Updates
     * @param {*} req
     * @param {*} res
     */
    static async deleteUpdates(req, res) {
        const data = await updatesService.deleteUpdates(
            req.params.id,
            req,
            res
        );
        return;
    }
}

export default updateController;
