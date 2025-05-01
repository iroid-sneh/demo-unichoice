import Banners from "../../../models/banners";
import path from "path";
import fs from "fs";

class bannersServices {
    /**
     * @description: Banners Page
     * @param {*} req
     * @param {*} res
     */
    static async bannersPage(req, res) {
        return res.render("banners/banners");
    }

    /**
     * @description: Banners List
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async bannersList(query, req, res) {
        const { draw, start, length, search } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;
        const search_value = search.value;
        const search_query = {
            $or: [
                {
                    link: { $regex: search.value, $options: "i" },
                },
            ],
        };

        const data = await Banners.find(search_value ? search_query : {})
            .skip(page)
            .limit(limit)
            .sort({ createdAt: -1 });

        const count = await Banners.countDocuments({});

        const total_records_with_filter = await Banners.countDocuments(
            search_query
        );

        return res.json({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: total_records_with_filter,
            aaData: data,
        });
    }

    /**
     * @description: Add Banners Page
     * @param {*} req
     * @param {*} res
     */
    static async addBannersPage(req, res) {
        return res.render("banners/addBanners");
    }

    /**
     * @description: Add Banners
     * @param {*} data
     * @param {*} file
     * @param {*} req
     * @param {*} res
     */
    static async addBanners(data, file, req, res) {
        let image = null;
        if (file) {
            image = `banners/${file.filename}`;
        }

        await Banners.create({
            image: image,
            link: data.link,
        });

        req.flash("success", "Banner Added Successfully");
        return res.redirect("/admin/banners");
    }

    /**
     * @description: Delete Banner
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteBanner(id, req, res) {
        const findBanner = await Banners.findById({ _id: id });
        if (!findBanner) {
            req.flash("error", "Banner not Found");
            return res.redirect("/admin/banners");
        }
        try {
            await fs.unlinkSync(
                path.join(__dirname, "../../../public/", findBanner.image)
            );
            await Banners.findByIdAndDelete(id);

            req.flash("success", "Banner Deleted Successfully");
            return res.redirect("/admin/banners");
        } catch (error) {
            console.log("Error", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
}
export default bannersServices;
