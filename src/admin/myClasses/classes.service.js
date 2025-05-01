import moment from "moment-timezone";
import Classes from "../../../models/classes";
import commonService from "../../../utils/common.service";
import fs from "fs";
import path from "path";

class classesService {
    /**
     * @description: Classes Page
     * @param {*} req
     * @param {*} res
     */
    static async classesPage(req, res) {
        return res.render("classes/classes");
    }

    /**
     * @description: Classes Lists
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async classesList(query, req, res) {
        try {
            const { start, draw, search, length } = query;
            const page = parseInt(start) || 0;
            const limit = parseInt(length) || 10;
            const search_value = search?.value || "";
            const search_query = {};

            if (search_value) {
                search_query = {
                    $or: [
                        { className: { $regex: search_value, $options: "i" } },
                        {
                            description: {
                                $regex: search_value,
                                $options: "i",
                            },
                        },
                        {
                            embadedLink: {
                                $regex: search_value,
                                $options: "i",
                            },
                        },
                        { type: { $in: [new RegExp(search_value, "i")] } },
                    ],
                };

                if (!isNaN(Date.parse(search_value))) {
                    const dateValue = new Date(search_value);
                    search_query.$or.push(
                        { startTime: { $gte: dateValue } },
                        { endTime: { $gte: dateValue } }
                    );
                }
            }

            const data = await Classes.find(search_value ? search_query : {})
                .skip(page)
                .limit(limit)
                .sort({ createdAt: -1 });

            const count = await commonService.totalDocuments(Classes, data);

            const total_records_with_filter =
                await commonService.totalDocuments(Classes, search_query);

            return res.status(200).send({
                draw: draw,
                iTotalRecords: count,
                iTotalDisplayRecords: total_records_with_filter,
                aaData: data,
            });
        } catch (error) {
            console.error("Error in My ClassesList", error);
            return res.status(500).send({
                error: "Internal Server Error",
                message: error.message,
            });
        }
    }

    /**
     * @description: Add Classes Page
     * @param {*} req
     * @param {*} res
     */
    static async addClassesPage(req, res) {
        return res.render("classes/addClasses");
    }

    /**
     * @description: Add Classes
     * @param {*} data
     * @param {*} file
     * @param {*} req
     * @param {*} res
     */
    static async addClasses(data, file, req, res) {
        const { startTime, endTime } = data;
        // console.log("starttime: ", startTime);
        // console.log("endtime: ", endTime);
        const StartTimeUTC = moment
            .tz(startTime, "Asia/Kolkata")
            .utc()
            .toDate();
        // console.log("StartTime :", StartTimeUTC);

        const endTimeUTC = moment.tz(endTime, "Asia/Kolkata").utc().toDate();
        // console.log("EndTime :", endTimeUTC);

        if (file) {
            const image = `/myClasses/${file.filename}`;
            const myClasses = await commonService.createOne(Classes, {
                thumbnail: file ? image : null,
                className: data.className,
                description: data.description,
                startTime: StartTimeUTC,
                endTime: endTimeUTC,
                embadedLink: data.embadedLink,
                type: data.type,
            });
            req.flash("success", "Class Created Successfully");
            return res.redirect("/admin/myClasses");
        }
    }

    /**
     * @description: Update Classes Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async updateClassPage(id, req, res) {
        const findClass = await Classes.findById(id);
        if (!findClass) {
            req.flash("error", "Class Not Found");
            return res.redirect("/admin/myClasses");
        }

        return res.render("classes/updateClasses", {
            moment: moment,
            classesId: findClass,
        });
    }

    /**
     * @description: Update Classes by id
     * @param {*} id
     * @param {*} data
     * @param {*} file
     * @param {*} req
     * @param {*} res
     */
    static async updateClasses(id, data, file, req, res) {
        const findClass = await commonService.findById(Classes, { _id: id });
        const { startTime, endTime } = data;

        const formatedStartTime = moment
            .tz(startTime, "Asia/Kolkata")
            .utc()
            .toDate();
        const formatedEndTime = moment
            .tz(endTime, "Asia/Kolkata")
            .utc()
            .toDate();
        if (!findClass) {
            req.flash("error", "Class Not Found");
            return res.redirect("/admin/myClasses");
        }

        let updateData = {
            thumbnail: data.thumbnail,
            className: data.className,
            description: data.description,
            startTime: formatedStartTime,
            endTime: formatedEndTime,
            embadedLink: data.embadedLink,
            type: data.type,
        };

        if (file) {
            const image = `/myClasses/${file.filename}`;
            updateData.thumbnail = image;

            try {
                if (findClass.thumbnail) {
                    fs.unlinkSync(
                        path.join(
                            __dirname,
                            "../../../public/",
                            findClass.thumbnail
                        )
                    );
                }
            } catch (error) {
                console.error("Error", error);
            }
        }

        await commonService.updateOne(Classes, { _id: id }, updateData);
        req.flash("success", "Class Updated Successfully");
        return res.redirect("/admin/myClasses");
    }

    /**
     * @description: Delete Classes
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteClasses(id, req, res) {
        const findClass = await commonService.deleteById(Classes, { _id: id });
        if (!findClass) {
            req.flash("error", "Class Not Found");
            return res.redirect("/admin/myClasses");
        } else {
            try {
                fs.unlinkSync(
                    path.join(
                        __dirname,
                        "../../../public/",
                        findClass.thumbnail
                    )
                );
                req.flash("success", "Class Deleted Successfully");
                return res.redirect("/admin/myClasses");
            } catch (error) {
                console.error("Error", error);
                // req.flash("error", "Error in Deleting Classes");
                return res.redirect("/admin/myClasses");
            }
        }
    }
}

export default classesService;
