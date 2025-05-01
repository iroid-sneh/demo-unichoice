import path from "path";
import Tag from "../../../models/tag";
import Updates from "../../../models/updates";
import UpdatesImages from "../../../models/updatesImage";
import commonService from "../../../utils/common.service";
import mongoose from "mongoose";
import fs from "fs";
import Ffmpeg from "fluent-ffmpeg";

class updatesService {
    /**
     * @description: Updates Page
     * @param {*} req
     * @param {*} res
     */
    static async TagPage(req, res) {
        return res.render("updates/tag");
    }

    /**
     * @description: Tag List
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async tagList(query, req, res) {
        const { search, length, draw, start } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;
        const search_value = search?.value || "";
        const search_query = {};

        if (search_value) {
            search_query = {
                $or: [
                    {
                        name: { $regex: search_value, $options: "i" },
                    },
                ],
            };
        }

        const data = await Tag.find(search_value ? search_query : {})
            .skip(page)
            .limit(limit)
            .sort({
                createdAt: -1,
            });
        const count = await Tag.countDocuments({});

        const total_records_with_filter = await Tag.countDocuments({
            search_query,
        });

        return res.status(200).send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: total_records_with_filter,
            aaData: data,
        });
    }

    /**
     * @description: Add Tag Page
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async addTag(data, req, res) {
        const { tagName } = data;
        try {
            const findTag = await commonService.findOne(Tag, {
                name: tagName,
            });
            if (findTag) {
                // req.flash("error", "Tag Already Exists");
                return res.status(400).json({
                    success: false,
                    message: "Tag Already Exists",
                });
            }

            await commonService.createOne(Tag, {
                name: tagName,
            });

            req.flash("success", "Tag Created Successfully");
            return res.status(200).json({
                success: true,
                message: "Tag Created Successfully",
            });
        } catch (error) {
            console.error("Error", error);
            return res.status(500).json({
                success: false,
                message: "Server Error",
            });
        }
    }

    /**
     * @description: Update tag
     * @param {*} id
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async updateTag(id, data, req, res) {
        const { tagName } = data;
        const findTag = await commonService.findById(Tag, { _id: id });
        if (!findTag) {
            // req.flash("error", "Tag Not Found");
            return res.redirect("/admin/updates");
        }

        await commonService.updateById(Tag, { _id: id }, { name: tagName });
        req.flash("success", "Tag Updated Successfully");
        return res.json({
            success: true,
            message: "Tag Updated Successfully",
        });
    }

    /**
     * @description: Delete Tag
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteTag(id, req, res) {
        const findTag = await commonService.findById(Tag, { _id: id });
        if (!findTag) {
            return res.status(400).json({
                success: false,
                message: "Tag not Found",
            });
        }

        await commonService.deleteById(Tag, { _id: id });
        req.flash("success", "Tag Deleted Successfully");

        return res.status(200).json({
            success: true,
            message: "Tag Deleted Successfully",
        });
    }

    /**
     * @description: Updates for Tags
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async TagUpdatesPage(id, req, res) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res
                    .status(400)
                    .json({ error: "Invalid ObjectId format" });
            }
            const findTag = await commonService.findById(Tag, { _id: id });

            return res.render("updates/tagUpdates", {
                tagId: findTag,
            });
        } catch (error) {
            console.error("Error fetching tag updates:", error);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }

    /**
     * @description: Tag Updates List
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async tagUpdatesList(id, req, res) {
        const { start, length, search, draw } = req.query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;

        const search_value = search.value;
        const search_query = {
            tagId: id,
            $or: [
                { title: new RegExp(search_value, "i") },
                { description: new RegExp(search_value, "i") },
            ],
        };

        const base_query = { tagId: id };
        const query = search_value ? search_query : base_query;

        const updates = await Updates.find(query)
            .skip(page)
            .limit(limit)
            .sort({ isPinned: -1, createdAt: -1 });

        // Get image counts for each update
        const data = await Promise.all(
            updates.map(async (update) => {
                const imageCount = await UpdatesImages.countDocuments({
                    updateId: update._id,
                });
                return {
                    ...update.toObject(),
                    imageCount,
                };
            })
        );

        const total_records = await Updates.countDocuments(base_query);
        const total_records_with_filter = await Updates.countDocuments(query);

        return res.json({
            draw: parseInt(draw),
            iTotalRecords: total_records,
            iTotalDisplayRecords: total_records_with_filter,
            aaData: data,
        });
    }

    /**
     * @description: Add Updates Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async addUpdatesPage(id, req, res) {
        const findTag = await commonService.findById(Tag, { _id: id });
        if (!findTag) {
            return res.status(400).json({
                success: false,
                message: "Cannot Find The Tag",
            });
        }
        return res.render("updates/addUpdates", {
            tagId: findTag,
        });
    }

    /**
     * @description: add Updates
     * @param {*} id
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async addUpdates(id, data, req, res) {
        try {
            const findTag = await commonService.findById(Tag, { _id: id });
            if (!findTag) {
                return res.status(400).json({
                    success: true,
                    message: "Cannot find The Tag",
                });
            }

            const publicDir = path.join(__dirname, "../../../public");
            const uploadDir = path.join(publicDir, "uploads");

            const updates = await commonService.createOne(Updates, {
                type: data.updateType,
                tagId: findTag._id,
                title: data.title,
                description: data.description,
                isPinned: data.isPinned,
            });
            if (req.files) {
                for (let file of req.files) {
                    if (
                        data.updateType === "3" &&
                        file.mimetype.startsWith("video/")
                    ) {
                        const thumbnailName = `${file.filename}_thumb.jpg`;
                        const thumbnailPath = path.join(
                            uploadDir,
                            thumbnailName
                        );

                        if (!fs.existsSync(uploadDir)) {
                            fs.mkdirSync(uploadDir, { recursive: true });
                        }

                        try {
                            await new Promise.all((resolve, reject) => {
                                Ffmpeg(path.join(uploadDir, file.filename))
                                    .screenshots({
                                        count: 1,
                                        folder: uploadDir,
                                        filename: thumbnailName,
                                        size: "320x240",
                                        timemarks: ["00:00:01"],
                                    })
                                    .on("end", () => {
                                        resolve();
                                    })
                                    .on("error", (err) => {
                                        console.error(
                                            "Error in generating Thumbnail",
                                            err
                                        );
                                        reject(err);
                                    });
                            });

                            await commonService.createOne(UpdatesImages, {
                                updateId: updates._id,
                                image: `update/${file.filename}`,
                                thumbnail: `updates/${thumbnailName}`,
                                isVideo: true,
                            });
                        } catch (error) {
                            console.error("Error in thumbnail generation");
                            await commonService.createOne(UpdatesImages, {
                                updateId: updates._id,
                                image: `updates/${file.filename}`,
                                isVideo: true,
                            });
                        }
                    } else {
                        await commonService.createOne(UpdatesImages, {
                            updateId: updates._id,
                            image: `updates/${file.filename}`,
                        });
                    }
                }
            }
            req.flash("success", "Updates Added Successfully");
            return res.json({
                success: true,
                message: "Updates Added Successfully",
            });
        } catch (error) {
            console.error("Error In Adding Uploads", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    /**
     * @description: Edit Updates Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async editUpdatesPage(id, req, res) {
        const findUpdate = await commonService.findById(Updates, { _id: id });
        // const findtag = await commonService.findById(Tag, { _id: id });
        if (!findUpdate) {
            return res.status(400).json({
                success: false,
                message: "Update not Found",
            });
        }

        return res.render("updates/editUpdates", {
            update: findUpdate,
            tag: findUpdate.tagId,
        });
    }

    /**
     * @description: edit Updates
     * @param {*} id
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async editUpdates(id, data, req, res) {
        try {
            const update = await Updates.findById(id);

            const { title, description, isPinned } = data;
            await Updates.updateOne(
                { _id: id },
                {
                    title: title,
                    description: description,
                    isPinned: isPinned === "true" ? true : false,
                }
            );

            if (req.files) {
                const publicDir = path.join(__dirname, "../../../public");
                const updatesDir = path.join(publicDir, "updates");
                if (!fs.existsSync(updatesDir)) {
                    fs.mkdirSync(updatesDir, { recursive: true });
                }

                for (let file of req.files) {
                    const imagePath = `updates/${file.filename}`;
                    const findImage = UpdatesImages.findOne({
                        updateId: id,
                        image: imagePath,
                    });
                    if (!findImage) {
                        if (
                            update.type === 3 &&
                            file.mimetype.startsWith("video/")
                        ) {
                            // Generate thumbnail for video
                            const thumbnailName = `${file.filename}_thumb.jpg`;
                            const thumbnailPath = path.join(
                                updatesDir,
                                thumbnailName
                            );

                            try {
                                await new Promise((resolve, reject) => {
                                    Ffmpeg(path.join(updatesDir, file.filename))
                                        .screenshots({
                                            count: 1,
                                            folder: updatesDir,
                                            filename: thumbnailName,
                                            size: "320x240",
                                            timemarks: ["00:00:01"],
                                        })
                                        .on("end", () => {
                                            resolve();
                                        })
                                        .on("error", (err) => {
                                            console.error(
                                                "Error generating thumbnail:",
                                                err
                                            );
                                            reject(err);
                                        });
                                });

                                // Store both video and thumbnail
                                await UpdatesImages.create({
                                    updateId: update._id,
                                    image: imagePath,
                                    thumbnail: `updates/${thumbnailName}`,
                                    isVideo: true,
                                });
                            } catch (error) {
                                console.error(
                                    "Thumbnail generation failed:",
                                    error
                                );
                                // Continue with video upload even if thumbnail fails
                                await UpdatesImages.create({
                                    updateId: update._id,
                                    image: imagePath,
                                    isVideo: true,
                                });
                            }
                        } else {
                            // Store regular image
                            await UpdatesImages.create({
                                updateId: update._id,
                                image: imagePath,
                            });
                        }
                    }
                }
            }
            return res.json({
                success: true,
                message: "Update Edited Successfully",
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    }

    /**
     * @description: Delete Updates
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteUpdates(id, req, res) {
        const findUpdate = await commonService.findById(Updates, { _id: id });
        
    }
}

export default updatesService;
