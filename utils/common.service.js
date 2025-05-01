class commonService {
    //Find All Records from database
    static async findAllRecords(model, query) {
        const result = await model.find(query);
        return result;
    }

    //Find One Record
    static async findOne(model, query) {
        const result = await model.findOne(query);
        return result;
    }

    //Insert Single Record
    static async createOne(model, data) {
        const result = await model.create(data);
        return result;
    }

    //Find Record by Id
    static async findById(model, id) {
        const result = await model.findById(id);
        return result;
    }

    //Update record
    static async updateOne(model, query, data) {
        const result = await model.updateOne(query, data);
        return result;
    }

    //delete record
    static async deleteOne(model, query, data) {
        const result = await model.deleteOne(query, data);
        return result;
    }

    //delete Many
    static async deleteMany(model, query) {
        const result = await model.deleteMany(query);
        return result;
    }

    /**
     * @description: Update any record by id
     * @param {*} model
     * @param {*} id
     * @param {*} data
     */
    static async updateById(model, id, data) {
        const result = await model.findByIdAndUpdate(id, data, { new: true });
        return result;
    }

    /**
     * @description: update many records
     * @param {*} req
     * @param {*} res
     */
    static async updateMany(model, query, data) {
        const result = await model.updateMany(query, data);
        return result;
    }

    /**
     * @description: Find One and Update
     * @param {*} req
     * @param {*} res
     */
    static async findOneAndUpdate(model, query, data) {
        const result = await model.findOneAndUpdate(query, data, {
            new: true,
            upsert: true,
        });
        return result;
    }

    /**
     * @description: total document collection
     * @param {*} model
     * @param {*} data
     */
    static async totalDocuments(model, data) {
        const result = await model.countDocuments(data);
        return result;
    }

    /**
     * @description: Find single id by from table
     * @param {*} model
     * @param {*} query
     */
    static async findById(model, query) {
        const result = await model.findById(query);
        return result;
    }

    /**
     * @description: Delete records from id
     * @param {*} model
     * @param {*} id
     */
    static async deleteById(model, id) {
        const result = await model.findByIdAndDelete(id);
        return result;
    }

    /**
     * @description: Delete Any records from db
     * @param {*} model
     * @param {*} data
     */
    static async findOneAndDelete(model, data) {
        const result = await model.findOneAndDelete(data);
        return result;
    }
}

export default commonService;
