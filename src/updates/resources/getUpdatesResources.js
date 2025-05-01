import moment from "moment";
import { baseUrl } from "../../common/constants/constant";

class getUpdatesResources {
    constructor(data) {
        return data.map((element) => {
            const updates = element.updates.map((update) => {
                return {
                    title: update.title,
                    createdAt: moment(update.createdAt)
                        .tz("Asia/Kolkata")
                        .unix(),
                    updatedAt: moment(update.updatedAt)
                        .tz("Asia/Kolkata")
                        .unix(),
                };
            });
            return {
                _id: element._id,
                name: element.name,
                city: element.city,
                image: baseUrl(`/${element.image}`),
                state: element.state,
                isApplied: element.isApplied,
                isInterested: element.isInterested,
                collegeAppLink: element.collegeAppLink,
                updates,
            };
        });
    }
}

export default getUpdatesResources;
