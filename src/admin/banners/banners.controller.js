import bannersServices from "./banners.service";

class bannersController {
    /**
     * @description: Banners Page
     * @param {*} req
     * @param {*} res
     */
    static async bannersPage(req, res) {
        const data = await bannersServices.bannersPage(req, res);
        return;
    }

    /**
     * @description: Banners List
     * @param {*} req
     * @param {*} res
     */
    static async bannersList(req, res) {
        const data = await bannersServices.bannersList(req.query, req, res);
        return;
    }

    /**
     * @description: Add Banners Page
     * @param {*} req
     * @param {*} res
     */
    static async addBannersPage(req, res) {
        const data = await bannersServices.addBannersPage(req, res);
        return;
    }

    /**
     * @description: Add Banners
     * @param {*} req
     * @param {*} res
     */
    static async addBanners(req, res) {
        const data = await bannersServices.addBanners(
            req.body,
            req.file,
            req,
            res
        );
        return;
    }

    /**
     * @description: Delete Banner
     * @param {*} req
     * @param {*} res
     */
    static async deleteBanner(req, res) {
        const data = await bannersServices.deleteBanner(
            req.params.id,
            req,
            res
        );
        return;
    }
}

export default bannersController;
