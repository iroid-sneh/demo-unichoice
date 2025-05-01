import moment from "moment";
import Colleges from "../../models/colleges";
import Updates from "../../models/updates";
import UpdatesImages from "../../models/updatesImage";
import Tag from "../../models/tag";
import getUpdatesResources from "./resources/getUpdatesResources";
import { baseUrl } from "../common/constants/constant";

function removeExtraSpace(description) {
    return description.replace(/(\r?\n)+/g, "\r\n").trim();
}

class updatesServices {
    /**
     * @description: Get Colleges Updates
     * @param {*} req
     * @param {*} res
     */
    static async getUpdates(req, res) {
        try {
            const userId = req.user.userId;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const totalCount = await Colleges.aggregate([
                {
                    $lookup: {
                        from: "updates",
                        localField: "_id",
                        foreignField: "collegeId",
                        as: "updates",
                    },
                },
                {
                    $match: {
                        updates: { $ne: [] },
                    },
                },
                {
                    $count: "total",
                },
            ]);

            const colleges = await Colleges.aggregate([
                {
                    $lookup: {
                        from: "updates",
                        localField: "_id",
                        foreignField: "collegeId",
                        as: "updates",
                    },
                },
                {
                    $match: {
                        updates: { $ne: [] },
                    },
                },
                {
                    $lookup: {
                        from: "collegeapplications",
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
                                                    { $toObjectId: userId },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "application",
                    },
                },
                {
                    $lookup: {
                        from: "interesteds",
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
                                                    { $toObjectId: userId },
                                                ],
                                            },
                                        ],
                                    },
                                },
                            },
                        ],
                        as: "interested",
                    },
                },
                {
                    $lookup: {
                        from: "states",
                        localField: "state",
                        foreignField: "_id",
                        as: "stateDetails",
                    },
                },
                {
                    $unwind: {
                        path: "$stateDetails",
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $set: {
                        updates: {
                            $sortArray: {
                                input: "$updates",
                                sortBy: { updatesAt: -1 },
                            },
                        },
                    },
                },
                {
                    $project: {
                        city: 1,
                        image: 1,
                        name: 1,
                        collegeAppLink: 1,
                        state: "$stateDetails.name",
                        isApplied: { $gt: [{ $size: "$application" }, 0] },
                        isInterested: { $gt: [{ $size: "$interested" }, 0] },
                        updates: {
                            $map: {
                                input: "$updates",
                                as: "update",
                                in: {
                                    updatedAt: "$$update.updatedAt",
                                    title: "$$update.title",
                                    createdAt: "$$update.createdAt",
                                    isPinned: "$$update.isPinned",
                                },
                            },
                        },
                        latestUpdateAt: {
                            $arrayElemAt: ["$updates.updatedAt", 0],
                        },
                        isPinned: {
                            $gt: [
                                {
                                    $size: {
                                        $filter: {
                                            input: "$updates",
                                            as: "u",
                                            cond: {
                                                $eq: ["$$u.isPinned", true],
                                            },
                                        },
                                    },
                                },
                                0,
                            ],
                        },
                    },
                },
                {
                    $sort: {
                        isPinned: -1,
                        latestUpdateAt: -1,
                    },
                },
                {
                    $skip: skip,
                },
                {
                    $limit: limit,
                },
            ]);

            const total = totalCount.length > 0 ? totalCount[0].total : 0;

            return res.status(200).json({
                success: true,
                data: new getUpdatesResources(colleges),
                meta: {
                    total,
                    perPage: limit,
                    currentPage: page,
                    lastPage: Math.ceil(total / limit),
                },
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
     * @description: Get All Tags List with Updates
     * @param {*} req
     * @param {*} res
     */
    static async tags(req, res) {
        try {
            const tags = await Tag.find().sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                data: tags,
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
     * @description: Updates List of Colleges
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async collegeUpdatesList(id, req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.page) || 10;
            const type = req.query.type;
            const skip = (page - 1) * limit;
            if (type !== "0" && type !== "1") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid Type",
                });
            }

            let updates;
            if (type == "0") {
                updates = await Updates.find({ collegeId: id })
                    .skip(skip)
                    .limit(limit)
                    .sort({ isPinned: -1, updatedAt: -1 });
            } else {
                updates = await Updates.find({ tagId: id })
                    .skip(skip)
                    .limit(limit)
                    .sort({ isPinned: -1, updatedAt: -1 });
            }

            const total = await Updates.countDocuments({ collegeId: id });
            const lastPage = Math.ceil(total / limit);
            const updateWithImage = await Promise.all(
                updates.map(async (update) => {
                    const images = await UpdatesImages.find({
                        updateId: update._id,
                    });
                    return {
                        ...update._doc,
                        description: removeExtraSpace(update.description),
                        createdAt: moment(update.createdAt)
                            .tz("Asia/Kolkata")
                            .unix(),
                        updatedAt: moment(update.updatedAt)
                            .tz("Asia/Kolkata")
                            .unix(),
                        mediaFiles: images.map((img) => baseUrl(img.image)),
                        thumbnail:
                            images.length > 0
                                ? baseUrl(images[0].thumbnail)
                                : "",
                    };
                })
            );
            return res.staus(200).json({
                success: true,
                data: updateWithImage,
                meta: {
                    total,
                    perPage: limit,
                    currentPage: page,
                    lastPage: lastPage,
                },
            });
        } catch (error) {
            console.log("Error", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
}

export default updatesServices;
