import Classes from "../../models/classes";
import commonService from "../../utils/common.service";
import getClassesResources from "./resources/getClassesResources";

class classesServices {
    /**
     * @description: Get Classes List
     * @param {*} query
     * @param {*} req
     * @param {*} res
     */
    static async getClasses(query, req, res) {
        const page = parseInt(query.page);
        const pageLimit = query.limit ? parseInt(query.limit) : 10;
        const currentDate = new Date();
        const update = await Classes.updateMany(
            { endTime: { $lt: currentDate }, isCompleted: false },
            { $set: { isCompleted: true } }
        );

        const queryCondition = {
            isCompleted: false,
        };

        let total = await commonService.totalDocuments(Classes, queryCondition);
        let findClass;
        if (pageLimit > 0) {
            findClass = await Classes.find(queryCondition)
                .skip((page - 1) * pageLimit)
                .sort({ startTime: 1 })
                .limit(pageLimit)
                .sort({ createdAt: -1 });
        } else {
            findClass = await Classes.find(queryCondition);
        }

        const meta = {
            total,
            perPage: pageLimit > 0 ? pageLimit : total,
            currentPage: total,
            lastPage: pageLimit > 0 ? Math.ceil(total / pageLimit) : 1,
        };

        return res.status(200).send({
            success: true,
            data: new getClassesResources(findClass),
            meta,
        });
    }
}

export default classesServices;
