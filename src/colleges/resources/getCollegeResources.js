import { baseUrl } from "../../common/constants/constant";
import getHighlightResources from "./getHighlightResources";

class getCollegeResources {
    constructor(data) {
        return data.map((element) => {
            return {
                _id: element._id,
                name: element.name,
                state: element.state.name,
                city: element.city,
                nirfRank: element.nirfRank,
                stream: element.stream.map((ele) => ele.name),
                averageTutionFee: element.averageTutionFee,
                image: baseUrl(`${element.image}`),
                top200: element.top200,
                highlight: new getHighlightResources(element.highlight),
                isApplied: element.isApplied,
                isInterested: element.isInterested,
                freeApplication: element.freeApplication,
                collegeAppLink: element.collegeAppLink,
            };
        });
    }
}

export default getCollegeResources;
