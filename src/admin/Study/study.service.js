import fs from "fs";
import path from "path";
import StudyMaterials from "../../../models/studyMaterials";
import StudyColleges from "../../../models/studyColleges";
import commonService from "../../../utils/common.service";

class studySerivce {
    /**
     * @description: Study Materials Page
     * @param {*} req
     * @param {*} res
     */
    static async studyPage(req, res) {
        return res.render("study/study");
    }

    /**
     * @description: Study Materials College List
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async studyCollegeList(query, req, res) {
        try {
            const { start, draw, length, search } = query;
            const page = parseInt(start) || 0;
            const limit = parseInt(length) || 10;
            const search_value = search?.value || "";
            const search_query = {};

            if (search_value) {
                search_query = {
                    $or: [
                        {
                            collegeName: {
                                $regex: search_value,
                                $options: "i",
                            },
                        },
                        {
                            location: {
                                $regex: search_value,
                                $options: "i",
                            },
                        },
                    ],
                };
            }

            const data = await StudyColleges.find(
                search_value ? search_query : {}
            )
                .skip(page)
                .limit(limit)
                .sort({ createdAt: -1 });

            const count = await commonService.totalDocuments(
                StudyColleges,
                data
            );

            const total_records_with_filter =
                await commonService.totalDocuments(StudyColleges, search_query);

            return res.status(200).send({
                draw: draw,
                iTotalRecords: count,
                iTotalDisplayRecords: total_records_with_filter,
                aaData: data,
            });
        } catch (error) {
            console.error("Error", error);
            return res.status(200).send({
                error: error,
                message: error.message,
            });
        }
    }

    /**
     * @description: Study Materials colleges Page
     * @param {*} req
     * @param {*} res
     */
    static async addCollegesPage(req, res) {
        return res.render("study/addColleges");
    }

    /**
     * @description: Add Colleges
     * @param {*} data
     * @param {*} file
     * @param {*} req
     * @param {*} res
     */
    static async addColleges(data, file, req, res) {
        if (file) {
            const image = `study/${file.filename}`;
            const colleges = await commonService.createOne(StudyColleges, {
                collegeName: data.collegeName,
                location: data.location,
                logo: file ? image : null,
            });
            req.flash("success", "College Added Successfully");
            return res.redirect("/admin/study-materials");
        }
    }

    /**
     * @description: Update colleges Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async updateCollegesPage(id, req, res) {
        const findCollege = await commonService.findById(StudyColleges, {
            _id: id,
        });
        return res.render("study/updateCollege", {
            collegeId: findCollege,
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
        const findCollege = await commonService.findById(StudyColleges, {
            _id: id,
        });

        if (!findCollege) {
            req.flash("error", "College not Found");
            return res.redirect("/admin/study-materials");
        }

        const updateData = {
            collegeName: data.collegeName,
            location: data.location,
            logo: data.logo,
        };

        if (file) {
            const image = `study/${file.filename}`;
            updateData.logo = image;

            try {
                if (findCollege.logo) {
                    fs.unlinkSync(
                        path.join(
                            __dirname,
                            "../../../public/",
                            findCollege.logo
                        )
                    );
                }
            } catch (error) {
                console.error("error in Updateing College Logo", error);
                // res.redirect("/admin/study-materials");
            }
        }
        await commonService.updateById(StudyColleges, { _id: id }, updateData);
        req.flash("success", "College Updated  Successfully");
        return res.redirect("/admin/study-materials");
    }

    /**
     * @description: Delete Colleges
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteColleges(id, req, res) {
        const findCollege = await commonService.deleteById(StudyColleges, {
            _id: id,
        });

        if (!findCollege) {
            req.flash("error", "College not Found");
            return res.redirect("/admin/study-materials");
        } else {
            try {
                fs.unlinkSync(
                    path.join(__dirname, "../../../public/", findCollege.logo)
                );
                req.flash("success", "College Deleted Successfully");
                return res.redirect("/admin/study-materials");
            } catch (error) {
                console.error("Error in Deleting College Logo", error);
                return res.redirect("/admin/study-materials");
            }
        }
    }

    /**
     * @description: Study Materials Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async materialsPage(id, req, res) {
        const findCollege = await commonService.findById(StudyColleges, {
            _id: id,
        });
        return res.render("study/materials", {
            collegeId: findCollege._id,
        });
    }

    /**
     * @description: Study Materials List
     * @param {*} id
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async materialsList(id, query, req, res) {
        const findCollege = await commonService.findById(StudyColleges, {
            _id: id,
        });

        if (!findCollege) {
            req.flash("error", "Materials Not Found With this ID");
            return res.redirect("/admin/study-materials");
        }

        const { start, draw, length, search } = query;
        const page = parseInt(start) || 0;
        const limit = parseInt(length) || 10;
        const search_value = search?.value || "";
        const search_query = {};

        if (search_value) {
            search_query = {
                collegeId: id,
                ...(search_value
                    ? {
                          title: { $regex: search_value, $options: "i" },
                      }
                    : {}),
            };
        }
        try {
            const data = await StudyMaterials.find(search_query)
                .skip(page * limit)
                .limit(limit)
                .sort({ createdAt: -1 });

            const total_records = await StudyMaterials.countDocuments({
                collegeId: id,
            });
            const total_records_with_filter =
                await StudyMaterials.countDocuments(search_query);

            return res.send({
                draw: draw,
                iTotalRecords: total_records,
                iTotalDisplayRecords: total_records_with_filter,
                aaData: data,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({
                error: "Failed to fetch study materials",
            });
        }
    }

    /**
     * @description: Add Materials Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async addMaterialsPage(id, req, res) {
        const findCollege = await commonService.findById(StudyColleges, {
            _id: id,
        });

        return res.render("study/addMaterials", {
            collegeId: findCollege._id,
        });
    }

    /**
     * @description: Add Materials
     * @param {*} id
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async addMaterials(id, data, req, res) {
        const findCollege = await commonService.findById(StudyColleges, {
            _id: id,
        });
        if (!findCollege) {
            res.status(500).send({
                err: "Cant Find the college with this ID",
            });
            return res.redirect(`/admin/study-materials`);
        }
        try {
            await commonService.createOne(StudyMaterials, {
                collegeId: findCollege._id,
                title: data.title,
                fileLinks: data.fileLinks,
            });
            req.flash("success", "Material added Successfully");
            return res.redirect(
                `/admin/study-materials/materials/${findCollege._id}`
            );
        } catch (error) {
            console.error(
                "Error in Uploading Materials for The Colleges",
                error
            );
        }
    }

    /**
     * @description: Update Materials Page
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async updateMaterialsPage(id, req, res) {
        const findMaterial = await StudyMaterials.findById({ _id: id });

        const findCollege = await StudyMaterials.findOne({ _id: id });

        return res.render("study/updateMaterials", {
            collegeId: findCollege.collegeId,
            materialId: findMaterial,
        });
    }

    /**
     * @description: Update Materials
     * @param {*} id
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async updateMaterials(id, data, req, res) {
        const findMaterial = await commonService.findById(StudyMaterials, {
            _id: id,
        });

        const updateData = {
            title: data.title,
            fileLinks: data.fileLinks,
        };
        await commonService.updateById(StudyMaterials, { _id: id }, updateData);
        req.flash("success", "Material Updated Successfully");
        return res.redirect(
            `/admin/study-materials/materials/${findMaterial.collegeId}`
        );
    }

    /**
     * @description: Delete Materials
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async deleteMaterials(id, req, res) {
        const findCollege = await commonService.findById(StudyMaterials, {
            _id: id,
        });

        const findMaterial = await commonService.deleteById(StudyMaterials, {
            _id: id,
        });

        req.flash("success", "Material Deleted Successfully");
        return res.redirect(
            `/admin/study-materials/materials/${findCollege.collegeId}`
        );
    }
}

export default studySerivce;
