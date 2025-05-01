import bannerServices from "./banner.service";

class bannerController {
    /**
     * @description: Get Banners
     * @param {*} req
     * @param {*} res
     */
    static async getBanners(req, res) {
        const data = await bannerServices.getBanners(req, res);
        return;
    }
}

export default bannerController;
