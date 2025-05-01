import Banners from "../../models/banners";
import { baseUrl } from "../common/constants/constant";

class bannerServices {
    /**
     * @description: Get Banners
     * @param {*} req
     * @param {*} res
     */
    static async getBanners(req, res) {
        try {
            const banners = await Banners.find();
            const data = banners.map((banner) => ({
                id: banner._id,
                image: baseUrl(banner.image),
                link: banner.link,
            }));
            return res.status(200).json({ success: true, data });
        } catch (error) {
            console.log("Error", error);
            return res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
        }
    }
}

export default bannerServices;
