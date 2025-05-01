class getMaterialResources {
    constructor(data) {
        return data.map((element) => {
            return {
                _id: element._id,
                collegeId: element.collegeId,
                title: element.title,
                fileLinks: element.fileLinks,
            };
        });
    }
}

export default getMaterialResources;
