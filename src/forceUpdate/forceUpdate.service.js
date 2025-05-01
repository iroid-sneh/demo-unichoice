import ForceUpdate from "../../models/forceUpdate";
import {
    BadRequestException,
    NotFoundException,
} from "../common/error-exception";

class forceUpdateServices {
    /**
     * @description: Force Update for Devices If not Updated
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async forceUpdate(data, req, res) {
        try {
            const { device_type, device_version } = data;
            const appVersion = await ForceUpdate.findOne({
                device_type: device_type,
            });

            if (!appVersion)
                throw new NotFoundException("Invalid Device Platform");

            let messages = {
                message: "Your app is up to Date",
                status: 0,
                appLink: appVersion.appLink,
            };

            if (device_version < appVersion.min_version) {
                messages = {
                    message:
                        "Your app is outdated, please update the latest version of app.",
                    status: 1,
                    appLink: appVersion.appLink,
                };
            } else if (
                device_version >= appVersion.min_version &&
                device_version < appVersion.current_version
            ) {
                messages = {
                    message:
                        "You are not using the latest version of please update to the latest version of app",
                    status: 2,
                    appLink: appVersion.appLink,
                };
            }

            return res.status(200).json({
                success: true,
                data: messages,
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

export default forceUpdateServices;
