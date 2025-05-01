import { baseUrl } from "../../common/constants/constant";

class getStudyCollegesResources {
    constructor(data) {
        return data.map((element) => {
            const base = baseUrl()?.replace(/\/$/, "");
            const cleanPathLogo = element.logo.replace(/^\+/, "");
            return {
                _id: element._id,
                collegeName: element.collegeName,
                location: element.location,
                logo: `${base}/${cleanPathLogo}`,
            };
        });
    }
}

export default getStudyCollegesResources;
