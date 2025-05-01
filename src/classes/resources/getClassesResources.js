import { baseUrl } from "../../common/constants/constant";
import moment from "moment-timezone";

class getClassesResources {
    constructor(data) {
        return data.map((element) => {
            return {
                _id: element._id,
                thumbnail:
                    element.thumbnail !== null
                        ? baseUrl(element.thumbnail)
                        : null,
                className: element.className,
                description: element.description,
                startTime: moment(element.startTime).tz("Asia/Kolkata").unix(),
                endTime: moment(element.endTime).tz("Asia/Kolkata").unix(),
                embadedLink: element.embadedLink,
                type: element.type,
            };
        });
    }
}

export default getClassesResources;
