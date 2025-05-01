import { baseUrl } from "../../common/constants/constant";

class getHighlightResources {
    constructor(data) {
        const image = [];
        data.map((element) => {
            console.log(element);
            image.push(baseUrl(`/${element.image}`));
        });
        return image;
    }
}

export default getHighlightResources;
