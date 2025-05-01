import Colleges from "../../models/colleges";
import Stream from "../../models/stream";
import State from "../../models/state";
import User from "../../models/user";
import Interested from "../../models/interested";
import Highlights from "../../models/highlight";
import CollegeApplications from "../../models/collegeApplications";
import RankCategory from "../../models/collegeRankCategory";
import CollegeRankCourse from "../../models/collegeRankCourse";
import getCollegeResources from "./resources/getCollegeResources";
import commonService from "../../utils/common.service";
import { baseUrl } from "../common/constants/constant";
import {
    sendApplicationPushNotification,
    sendStudentPushNotification,
} from "../common/helper";
import axios from "axios";
const { ObjectId, ReturnDocument } = require("mongodb");

class collegesService {
    /**
     * @description: Colleges List
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async collegesList(query, req, res) {
        try {
            const { userId } = req.user;
            const { stream, state } = req.query;
            const page = parseInt(query.page) || 1;
            const limit = query.limit ? parseInt(query.limit) : 10;
            const skip = (page - 1) * limit;

            let pipeline = [
                {
                    $lookup: {
                        from: "CollegeApplications",
                        let: { collegeId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$collegeId",
                                                    "$$collegeId",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$userId",
                                                    new ObjectId(userId),
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "isApplied",
                    },
                },
                {
                    $lookup: {
                        from: "Interested",
                        let: { collegeId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $eq: [
                                                    "$collegeId",
                                                    "$$collegeId",
                                                ],
                                            },
                                            {
                                                $eq: [
                                                    "$userId",
                                                    new ObjectId(userId),
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "isInterested",
                    },
                },
                {
                    $lookup: {
                        from: "highlights",
                        localField: "_id",
                        foreignField: "collegeId",
                        as: "highlight",
                    },
                },
                {
                    $addFields: {
                        isApplied: {
                            $cond: {
                                if: { $gt: [{ $size: "$isApplied" }, 0] },
                                then: true,
                                else: false,
                            },
                        },
                        isInterested: {
                            $cond: {
                                if: { $gt: [{ $size: "$isInterested" }, 0] },
                                then: true,
                                else: false,
                            },
                        },
                        highlight: "$highlight",
                    },
                },
                {
                    $lookup: {
                        from: "streams",
                        localField: "stream",
                        foreignField: "_id",
                        as: "streamData",
                    },
                },
                {
                    $lookup: {
                        from: "states",
                        localField: "state",
                        foreignField: "_id",
                        as: "stateData",
                    },
                },
                {
                    $addFields: {
                        stream: "$streamData",
                        state: { $arrayElemAt: ["$stateData", 0] },
                    },
                },
                {
                    $project: {
                        streamData: 0,
                        stateData: 0,
                    },
                },
                {
                    $sort: {
                        isInterested: -1,
                        index: 1,
                    },
                },
            ];

            if (stream) {
                pipeline.unshift({
                    $match: { Stream: { $in: [new ObjectId(stream)] } },
                });
            }

            if (state) {
                pipeline.unshift({
                    $match: { State: { $in: [new ObjectId(state)] } },
                });
            }

            const totalFilterdRecords = await Colleges.aggregate([
                ...pipeline,
                { $count: "total" },
            ]);

            const total =
                totalFilterdRecords.length > 0
                    ? totalFilterdRecords[0].total
                    : 0;
            pipeline.push(
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                }
            );

            const colleges = await Colleges.aggregate(pipeline);
            const meta = {
                total,
                limit,
                currentPage: page,
                lastPage: Math.ceil(total / limit),
            };

            return res.status(200).send({
                success: true,
                data: new getCollegeResources(colleges),
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
     * @description: Apply To Colleges
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async applyToColleges(data, req, res) {
        try {
            const userId = req.user.userId;
            const { collegeId } = data;

            const findCollege = await commonService.findById(Colleges, {
                _id: collegeId,
            });

            if (!findCollege) {
                return res
                    .status(400)
                    .json({ success: false, message: "College Not Found" });
            }

            const isApplied = await commonService.findOne(CollegeApplications, {
                userId: userId,
                collegeId: collegeId,
            });

            if (isApplied) {
                return res.status(400).json({
                    success: false,
                    message: "You have already Applied to this College",
                });
            }

            await commonService.createOne(CollegeApplications, {
                userId: userId,
                collegeId: collegeId,
                name: data.name,
                email: data.email,
                phone: data.phone,
                percentage: data.percentage,
            });

            const user = await commonService.findById(User, { _id: userId });

            const payload = {
                notification: {
                    title: "New Application Arrived",
                    body: `${user.fullName} hase applied for ${findCollege.name}`,
                },
                data: {
                    title: "New Application Arrived",
                    body: `${user.fullName} has applied for ${findCollege.name}`,
                    url: baseUrl("admin/student-applications"),
                },
            };

            sendApplicationPushNotification(payload);

            return res.status(200).json({
                success: true,
                message: `Applied to ${findCollege.name} Successfully`,
            });
        } catch (error) {
            console.log("Error", error);
            return res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
        }
    }

    /**
     * @description: add Colleges To Interested
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async interested(data, req, res) {
        const userId = req.user.userId;
        const { collegeId, type } = data;
        try {
            const findCollege = await commonService.findById(Colleges, {
                _id: collegeId,
            });
            if (!findCollege) {
                return res
                    .status(400)
                    .json({ success: true, message: "College Not Found" });
            }

            if (type === 0) {
                const isApplied = await commonService.findOne(Interested, {
                    userId: userId,
                    collegeId: collegeId,
                });
                if (!isApplied) {
                    const apply = await commonService.createOne(Interested, {
                        userId,
                        collegeId,
                    });
                    return res.status(200).json({
                        success: true,
                        message: `${findCollege.name} Added to Interest`,
                    });
                } else {
                    return res.status(400).json({
                        success: false,
                        message: `You Already Added ${findCollege.name} to Interest`,
                    });
                }
            } else if (type === 1) {
                const isApplied = await commonService.findOne(Interested, {
                    userId: userId,
                    collegeId: collegeId,
                });
                if (isApplied) {
                    await commonService.deleteOne(Interested, {
                        userId: userId,
                        collegeId: collegeId,
                    });
                    return res.status(200).json({
                        success: false,
                        message: `${findCollege.name} Removed From Interest`,
                    });
                } else {
                    return res.status(400).json({ success: false });
                }
            }
        } catch (error) {
            console.log("Error", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    /**
     * @description: User Preference Stream|States Colleges
     * @param {*} req
     * @param {*} res
     */
    static async preferenceList(req, res) {
        try {
            const userId = req.user.userId;
            const streams = await commonService.findAllRecords(Stream, {});
            const states = await commonService.findAllRecords(State, {});
            const interested = await commonService.totalDocuments(Interested, {
                userId: userId,
            });

            return res
                .status(200)
                .json({ success: true, data: { states, streams, interested } });
        } catch (error) {
            console.error("Error", error);
            return res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
        }
    }

    /**
     * @description: College Rank Page
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async rank(query, req, res) {
        try {
            const { rankCategoryId, rankCourseId, rank } = query;

            const findRankCategory = await commonService.findById(
                RankCategory,
                { _id: rankCategoryId }
            );
            if (!findRankCategory) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Rank CategoryID",
                });
            }

            const findRankCourse = await commonService.findById(
                CollegeRankCourse,
                { _id: rankCourseId }
            );
            if (!findRankCourse) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Rank CourseID",
                });
            }

            // Example https api = https://collegepredictor.unichoice.in/api/exam-result?exam=TNEA&rank=123451&category=MBC&courseType=Mechanical

            const request = await axios.get(
                "https://collegepredictor.unichoice.in/api/exam-result",
                {
                    params: {
                        exam: "TNEA",
                        category: findRankCategory.categoryName,
                        courseType: findRankCourse.courseName,
                        rank,
                    },
                }
            );

            return res.status(200).json({ success: true, data: request.data });
        } catch (error) {
            console.log("Error", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    /**
     * @description: College Rank Options
     * @param {*} req
     * @param {*} res
     */
    static async rankOptions(req, res) {
        try {
            const rankCategoryData = await commonService.findAllRecords(
                RankCategory,
                {}
            );
            const rankCourseData = await commonService.findAllRecords(
                CollegeRankCourse,
                {}
            );

            return res.status(200).json({
                success: true,
                data: {
                    category: rankCategoryData,
                    course: rankCourseData,
                },
            });
        } catch (error) {
            console.log("Error", error);
            return res
                .status(500)
                .json({ success: true, message: "Internal Server Error" });
        }
    }
}

export default collegesService;
