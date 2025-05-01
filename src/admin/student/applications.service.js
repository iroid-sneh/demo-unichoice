import CollegeApplications from "../../../models/collegeApplications";
import commonService from "../../../utils/common.service";

class applicationsServices {
    /**
     * @description: Students Page
     * @param {*} req
     * @param {*} res
     */
    static async applicationPage(req, res) {
        return res.render("studentsApplications/applications");
    }

    /**
     * @description: Studets List
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async collegeList(query, req, res) {
        try {
            const { draw = 1, start = 0, length = 10, search = {} } = query;
            const pipline = [
                {
                    $group: {
                        _id: "$collegeId",
                        applicationsCount: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: "colleges",
                        localField: "_id",
                        foreignField: "_id",
                        as: "college",
                    },
                },
                {
                    $unwind: "$college",
                },
                {
                    $project: {
                        _id: 1,
                        college: 1,
                        applicationsCount: 1,
                    },
                },
            ];

            if (search.value) {
                pipline.push({
                    $match: {
                        "college.name": {
                            $regex: search.value,
                            $options: "i",
                        },
                    },
                });
            }

            const totalRecord = await CollegeApplications.aggregate([
                ...pipline,
                { $count: "total" },
            ]);
            const total = totalRecord[0]?.total || 0;

            pipline.push(
                { $skip: parseInt(start) },
                { $limit: parseInt(length) }
            );

            const collegeList = await CollegeApplications.aggregate(pipline);

            return res.json({
                draw: parseInt(draw),
                recordsTotal: totalRecord,
                recordsFilterd: total,
                data: collegeList,
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
     * @description: Students Applications List By College ID
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async studentsListPage(id, req, res) {
        const findStudents = await CollegeApplications.find({ collegeId: id });
        return res.render("studentsApplications/students", {
            collegeId: id,
        });
    }

    /**
     * @description: STudents List
     * @param {*} id
     * @param {*} req
     * @param {*} res
     */
    static async studentsList(id, req, res) {
        const { start = 0, length = 10, draw = 1, search = {} } = req.query;
        let query = { collegeId: id };

        if (search.value) {
            query = {
                ...query,
                $or: [
                    { studentName: { $regex: search.value, $options: "i" } },
                    { email: { $regex: search.value, $options: "i" } },
                ],
            };
        }

        const total = await CollegeApplications.countDocuments(query);

        const students = await CollegeApplications.find(query)
            .skip(parseInt(start))
            .limit(parseInt(length));

        return res.json({
            draw: parseInt(draw),
            recordsTotal: total,
            recordsFilterd: total,
            data: students,
        });
    }
}

export default applicationsServices;
