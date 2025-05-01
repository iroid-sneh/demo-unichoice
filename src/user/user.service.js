import { baseUrl } from "../common/constants/constant";

class userServices {
    /**
     * @description: Terms and Conditions For The Users
     * @param {*} req
     * @param {*} res
     */
    static async termsAndConditions(req, res) {
        return res.status(200).json({
            success: true,
            data: {
                url: baseUrl("terms-and-conditions.pdf"),
                privacyPolicy: baseUrl("privacy-policy.pdf"),
            },
        });
    }
}

export default userServices;
