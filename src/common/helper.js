import User from "../../models/user";
import { baseUrl } from "../common/constants/constant";
import fcmToken from "../../models/fcmToken";
import FcmHelper from "../common/middleware/fcmHelper";

/**
 * @description: Random String Generator
 * @param {number} length : Length of String to be Generated (default is 75)
 * @return {number} : Return Generated String
 */
export const randomStringGenerator = (givenLength = 75) => {
    const characters =
        givenLength > 10
            ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ012345678901112131415ABCDEFGHIJKLMNOPQRSTUVWXYZ012345678901112131415"
            : "012345678901112131415ABCDEFGHIJKLMNOPQRSTUVWXYZ012345678901112131415ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length = givenLength;
    let randomString = "";

    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * characters.length);
        randomString += characters[randomNum];
    }
    return randomString;
};

/**
 * @description: Random Number Generator
 * @param {number} length: Length of Number to be Generated(default is 4)
 *@returns {number} : Return Generated Number
 */
export const randomNumberGenerator = (givenLength = 4) => {
    const number = "1234567890";
    const length = givenLength;
    let randomNumber = "";

    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * number.length);
        randomNumber += number[randomNum];
    }
    return randomNumber;
};

/**
 * @description: App Logo
 * @returns
 */
export const logo = () => {
    return baseUrl("icons/logo.png");
};

/**
 * @description: Email Logo
 * @returns
 */
export const emailLogo = () => {
    return baseUrl("icons/email-logo.png");
};

/**
 * @description: Send notification to Premium Users
 * @returns
 */
export const sendStudentPushNotification = async (NotificationData) => {
    const users = [];

    const premiumUser = await User.find({ isPremium: true });

    await Promise.all(
        premiumUser.map(async (document) => {
            const tokens = await fcmToken.find({ userId: document._id });
            tokens.forEach((user) => {
                users.push(user.token);
            });
        })
    );
    await FcmHelper.sendPushNotification(users, NotificationData);
};

export const sendApplicationPushNotification = async (notification) => {
    const users = [];
    const tokens = await fcmToken.find({ platform: "web" });
    tokens.forEach((user) => {
        users.push(user.token);
    });

    await FcmHelper.sendWebPushNotification(users, notification);
};
