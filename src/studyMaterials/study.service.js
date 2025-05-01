import mongoose from "mongoose";
import commonService from "../../utils/common.service";
import StudyColleges from "../../models/studyColleges";
import StudyMaterials from "../../models/studyMaterials";
import getStudyCollegesResources from "./resources/getStudyCollegesResources";
import getMaterialResources from "./resources/getMaterialResources";
import {
    BadRequestException,
    NotFoundException,
} from "../common/error-exception";

class studyServices {
    /**
     * @description: College List With Study Materials
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async collegeList(query, req, res) {
        const page = parseInt(query.page) || 1;
        const pageLimit = query.limit ? parseInt(query.limit) : 10;

        try {
            const collegeIds = await StudyMaterials.distinct("collegeId");

            const total = await StudyColleges.countDocuments({
                _id: { $in: collegeIds },
            });

            let findStudy;
            if (pageLimit > 0) {
                findStudy = await StudyColleges.find({
                    _id: { $in: collegeIds },
                })
                    .skip((page - 1) * pageLimit)
                    .limit(pageLimit);
            } else {
                findStudy = await StudyColleges.find({
                    _id: { $in: collegeIds },
                });
            }

            const meta = {
                total,
                perPage: pageLimit > 0 ? pageLimit : total,
                currentPage: total,
                lastPage: pageLimit > 0 ? Math.ceil(total / pageLimit) : 1,
            };

            return res.status(200).send({
                success: true,
                data: new getStudyCollegesResources(findStudy),
                meta,
            });
        } catch (error) {
            console.error("Error", error);
            return res.status(500).send({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    /**
     * @description: Get Study Materials From the Colleges
     * @param {*} id
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async getMaterials(id, query, req, res) {
        // const { query } = req.query;
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid CollegeID",
                });
            }

            const findCollege = await commonService.findById(StudyColleges, {
                _id: id,
            });
            if (!findCollege) {
                throw new NotFoundException(
                    "College not Found with following ID"
                );
            }

            const page = parseInt(query.page) || 1;
            const pageLimit = query.limit ? parseInt(query.limit) : 10;

            const total = await StudyMaterials.countDocuments({
                collegeId: findCollege._id,
            });

            let findStudy = await StudyMaterials.find({
                collegeId: findCollege._id,
            })
                .populate("collegeId")
                .skip((page - 1) * pageLimit)
                .limit(pageLimit);

            if (!findStudy.length) {
                return res.send({ data: [] });
            }

            const filteredData = findStudy.map((item) => ({
                collegeId: item.collegeId?._id,
                title: item.title,
                fileLinks: item.fileLinks,
            }));

            const meta = {
                total,
                perPage: pageLimit > 0 ? pageLimit : 1,
                currentPage: total,
                lastPage: pageLimit > 0 ? Math.ceil(total / pageLimit) : 1,
            };

            return res.status(200).send({
                success: true,
                data: new getMaterialResources(filteredData),
                meta,
            });
        } catch (error) {
            console.error("Error", error);
            return res.status(500).send({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
}

export default studyServices;
