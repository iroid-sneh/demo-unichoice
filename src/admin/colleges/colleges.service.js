import Colleges from "../../../models/colleges";
import States from "../../../models/state";
import Streams from "../../../models/stream";
import commonService from "../../../utils/common.service";
import path from "path";
import fs from "fs";
import Updates from "../../../models/updates";
import UpdatesImages from "../../../models/updatesImage";
import { baseUrl } from "../../common/constants/constant";

class collegeServices {
    /**
     * @description: Colleges Page
     * @param {*} req
     * @param {*} res
     */
    static async collegesPage(req, res) {
        const state = await commonService.findAllRecords(States, {});
        const stream = await commonService.findAllRecords(Streams, {});
        return res.render("colleges/colleges", {
            state,
            stream,
        });
    }

    /**
     * @description: College List
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async collegeList(query, req, res) {
        const { start, draw, length, search } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;
        const search_value = search?.value || "";
        const search_query = {};

        if (search_value) {
            search_query = {
                $or: [
                    { index: { $regex: search_value, $options: "i" } },
                    { name: { $regex: search_value, $options: "i" } },
                    { state: { $regex: search_value, $options: "i" } },
                    { city: { $regex: search_value, $options: "i" } },
                    { nirfRank: { $regex: search_value, $options: "i" } },
                    { stream: { $regex: search_value, $options: "i" } },
                    {
                        averageTutionFee: {
                            $regex: search_value,
                            $options: "i",
                        },
                    },
                    { image: { $regex: search_value, $options: "i" } },
                    { top200: { $regex: search_value, $options: "i" } },
                    {
                        freeApplications: {
                            $regex: search_value,
                            $options: "i",
                        },
                    },
                ],
            };
        }

        const data = await Colleges.find(search_value ? search_query : {})
            .skip(page)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate("state")
            .populate("stream");

        const count = await commonService.totalDocuments(Colleges, data);

        const total_records_with_filter = await commonService.totalDocuments(
            Colleges,
            search_query
        );

        return res.status(200).send({
            draw: draw,
            iTotalRecords: count,
            iTotalDisplayRecords: total_records_with_filter,
            aaData: data,
        });
    }

    /**
     * @description: Colleges Page
     * @param {*} req
     * @param {*} res
     */
    static async addCollegesPage(req, res) {
        const findStates = await commonService.findAllRecords(States, {});
        const findStreams = await commonService.findAllRecords(Streams, {});
        return res.render("colleges/addColleges", {
            states: findStates,
            streams: findStreams,
        });
    }

    /**
     * @description: Add Colleges
     * @param {*} data
     * @param {*} file
     * @param {*} req
     * @param {*} res
     */
    static async addColleges(data, file, req, res) {
        const image = `colleges/${file.filename}`;
        const addCollege = await commonService.createOne(Colleges, {
            image,
            ...data,
        });

        req.flash("success", "College Added Successfully");
        return res.json({
            success: true,
            message: "College Added Successfully",
        });
    }

    /**
     * @description: Chehck College Index
     * @param {*} req
     * @param {*} res
     */
    static async checkCollegesIndex(req, res) {
        const { index } = req.query;
        const findIndex = await commonService.findOne(Colleges, {
            index: index,
        });
        if (findIndex) {
            return res.json({
                success: false,
                message: "College Already Exsits with This Index",
            });
        } else {
            return res.json({
                success: true,
                message: "Index Available",
            });
        }
    }

    /**
     * @description: Delete Colleges
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteColleges(id, req, res) {
        const findCollege = await commonService.findById(Colleges, { _id: id });
        if (!findCollege) {
            req.flash("error", "College not Found with following ID");
        }
        try {
            fs.unlinkSync(
                path.join(__dirname, "../../../public/", findCollege.image)
            );
        } catch (error) {
            console.error("Error in Deleteing Colleges Image", error);
        }
        await commonService.findOneAndDelete(Colleges, { _id: id });
        req.flash("success", "College Deleted Successfully");
        return res.redirect("/admin/colleges");
    }

    /**
     * @description: Update Colleges Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async updateCollegesPage(id, req, res) {
        const findStates = await commonService.findAllRecords(States, {});
        const findStreams = await commonService.findAllRecords(Streams, {});
        const findCollege = await commonService.findById(Colleges, { _id: id });
        return res.render("colleges/updateColleges", {
            collegeId: findCollege,
            streams: findStreams,
            states: findStates,
        });
    }

    /**
     * @description: Update Colleges
     * @param {*} id
     * @param {*} data
     * @param {*} file
     * @param {*} req
     * @param {*} res
     */
    static async updateColleges(id, data, file, req, res) {
        const findCollege = await commonService.findById(Colleges, { _id: id });
        if (!findCollege) {
            req.flash("error", "College Not Found");
            return res.redirect("/admin/colleges");
        }

        const updateData = {
            index: data.index,
            image: data.image,
            name: data.name,
            state: data.state,
            city: data.city,
            nirfRank: data.nirfRank,
            stream: data.stream,
            averageTutionFee: data.averageTutionFee,
            top200: data.top200 === "on",
            freeApplication: data.freeApplication === "on",
            collegeAppLink: data.collegeAppLink,
        };

        if (file) {
            const img = `colleges/${file.filename}`;
            updateData.image = img;

            try {
                if (findCollege.image) {
                    fs.unlinkSync(
                        path.join(
                            __dirname,
                            "../../../public/",
                            findCollege.image
                        )
                    );
                }
            } catch (error) {
                console.log("Error in Deleteing College Image", error);
            }
        }

        await commonService.updateById(Colleges, { _id: id }, updateData);
        req.flash("success", "College Updated Successfully");
        return res.redirect("/admin/colleges");
        // return res.json({ success: true });
    }

    /**
     * @description: View Updates images and videos
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async viewUpdatesImages(id, req, res) {
        try {
            const images = await UpdatesImages.find({
                updateId: id,
            }).sort({ createdAt: -1 });
            const data = images.map((image) => ({
                _id: image._id,
                updateId: image.updateId,
                url: baseUrl(image.image),
            }));
            return res.status(200).json({
                success: true,
                data,
            });
        } catch (error) {
            console.error("Error", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    /**
     * @description: College Updates Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async collegeUpdates(id, req, res) {
        const findCollege = await commonService.findById(Colleges, { _id: id });
        if (!findCollege) {
            return res.status(400).json({
                success: false,
                message: "College Not Found",
            });
        }

        return res.render("colleges/updates", {
            collegeId: findCollege,
        });
    }

    /**
     * @description: College Updates List
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async collegeUpdatesList(id, req, res) {
        try {
            const { start, length, search, draw } = req.query;
            const page = parseInt(start) || 0;
            const limit = parseInt(length) || 10;

            const search_value = search.value;
            const search_query = {
                collegeId: id,
                $or: [
                    { title: new RegExp(search_value, "i") },
                    { description: new RegExp(search_value, "i") },
                ],
            };

            const base_query = { collegeId: id };
            const query = search_value ? search_query : base_query;

            const updates = await Updates.find(query)
                .skip(page)
                .limit(limit)
                .sort({ isPinned: -1, createdAt: -1 });

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
            const total_records_with_filter = await Updates.countDocuments(
                query
            );

            return res.json({
                draw: parseInt(draw),
                iTotalRecords: total_records,
                iTotalDisplayRecords: total_records_with_filter,
                aaData: data,
            });
        } catch (error) {
            console.log(error);
            return res.json({
                draw: 0,
                iTotalRecords: 0,
                iTotalDisplayRecords: 0,
                aaData: [],
            });
        }
    }

    /**
     * @description: Add Updates Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async addUpdatesPage(id, req, res) {
        const findCollege = await commonService.findById(Colleges, {
            _id: id,
        });
        if (!findCollege) {
            return res.status(400).json({
                success: false,
                message: "College Not Found",
            });
        }

        return res.render("colleges/addUpdates", {
            collegeId: findCollege,
        });
    }

    /**
     * @description: Add Updates For Colleges
     * @param {*} id
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async addUpdates(id, data, req, res) {
        try {
            const college = await commonService.findById(Colleges, { _id: id });
            if (!college) {
                return res.status(400).json({
                    success: false,
                    message: "Cant Find The College",
                });
            }

            // Create uploads/updates directory if it doesn't exist
            const publicDir = path.join(__dirname, "../../../public");
            const updatesDir = path.join(publicDir, "updates");

            const { title, description, isPinned, updateType } = data;
            const update = await Updates.create({
                title,
                description,
                isPinned,
                collegeId: id,
                type: updateType,
            });

            if (req.files) {
                for (let file of req.files) {
                    if (
                        updateType === "3" &&
                        file.mimetype.startsWith("video/")
                    ) {
                        // Generate thumbnail for video
                        const thumbnailName = `${file.filename}_thumb.jpg`;
                        const thumbnailPath = path.join(
                            updatesDir,
                            thumbnailName
                        );

                        // Ensure the updates directory exists
                        if (!fs.existsSync(updatesDir)) {
                            fs.mkdirSync(updatesDir, { recursive: true });
                        }

                        try {
                            await new Promise((resolve, reject) => {
                                ffmpeg(path.join(updatesDir, file.filename))
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

                            // Store both video and thumbnail with correct paths
                            await UpdatesImages.create({
                                updateId: update._id,
                                image: `updates/${file.filename}`,
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
                                image: `updates/${file.filename}`,
                                isVideo: true,
                            });
                        }
                    } else {
                        // Store regular image
                        await UpdatesImages.create({
                            updateId: update._id,
                            image: `updates/${file.filename}`,
                        });
                    }
                }
            }
            return res.json({
                success: true,
                message: "Update Added Successfully",
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
     * @description: Edit Colleges updates Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async editUpdatesPage(id, req, res) {
        const findCollege = await Updates.findOne({
            _id: id,
        });

        const findUpdates = await commonService.findById(Updates, { _id: id });
        if (!findUpdates) {
            return res.status(400).json({
                success: false,
                message: "Can't Find The College Update",
            });
        }

        return res.render("colleges/editUpdates", {
            updateId: findUpdates,
            collegeId: findCollege.collegeId,
        });
    }

    /**
     * @description: Edit College Updates
     * @param {*} id
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async editUpdates(id, data, req, res) {
        try {
            const update = await Updates.findById(id);

            const { title, description, isPinned } = req.body;
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
                                    ffmpeg(path.join(updatesDir, file.filename))
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
     * @description: Delete Images of College Updates
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteImage(id, req, res) {
        const findImage = await commonService.findById(UpdatesImages, {
            _id: id,
        });
        if (!findImage) {
            return res.status(400).json({
                success: true,
                message: "File Not Found",
            });
        }
        try {
            const mainFilePath = path.join(
                __dirname,
                "../../../public/",
                findImage.image
            );
            if (fs.existsSync(mainFilePath)) {
                fs.unlinkSync(mainFilePath);
            }

            if (findImage.isVideo && findImage.thumbnail) {
                const thumbnailPath = path.join(
                    __dirname,
                    "../../../public/",
                    findImage.thumbnail
                );
                if (fs.existsSync(thumbnailPath)) {
                    fs.unlinkSync(thumbnailPath);
                }
            }

            await commonService.deleteById(UpdatesImages, { _id: id });
            return res.json({
                success: false,
                message: "Media Deleted Successfully",
            });
        } catch (error) {
            console.log("Error", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    /**
     * @description: Delete Updates by id
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteUpdates(id, req, res) {
        const findUpdate = await commonService.findById(Updates, { _id: id });
        if (!findUpdate) {
            return res.status(400).json({
                success: false,
                message: "Update Not Found",
            });
        }
        await Updates.deleteOne({ _id: id });
        const deleteImages = await UpdatesImages.find({ updateId: id });
        if (deleteImages.length > 0) {
            for (const image of deleteImages) {
                try {
                    if (image.isVideo) {
                        fs.unlinkSync(
                            path.join(
                                __dirname,
                                "../../../public/",
                                image.image
                            )
                        );
                        if (image.thumbnail) {
                            fs.unlinkSync(
                                path.join(
                                    __dirname,
                                    "../../../public/",
                                    image.thumbnail
                                )
                            );
                        }
                    } else {
                        fs.unlinkSync(
                            path.join(
                                __dirname,
                                "../../../public/",
                                image.image
                            )
                        );
                    }
                } catch (error) {
                    console.log("Error", error);
                }
            }
        }

        await UpdatesImages.deleteMany({ updateId: id });
        return res.json({
            success: true,
            message: "Update Deleted Successfully",
        });
    }
}

export default collegeServices;
