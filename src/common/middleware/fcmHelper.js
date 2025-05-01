import admin from "firebase-admin";
import { logo } from "../helper";
import { BadRequestException } from "../error-exception";
// const serverKey = require("");

// admin.initializeApp({
//     credential: admin.credential.cert(serverKey),
// });

class fcmHelper {
    /**
     * @description: Send Push Notification For [Android|ios]
     * @param {*} tokens
     * @param {*} payload
     */
    static async sendPushNotification(tokens, payload) {
        try {
            tokens = tokens.filter((value, index, array) => {
                array.indexOf(value) === index;
            });

            if (tokens.length > 0) {
                const messaging = admin.messaging();
                const fcmMessages = [];

                tokens.map((token) => {
                    fcmMessages.push({
                        token: token,
                        //  APPLE PUSH NOTIFICATION
                        apns: {
                            payload: {
                                //  ANDROID PUSH NOTIFICATION
                                aps: {
                                    alert: payload.notification,
                                },
                            },
                        },
                        data: payload.data,
                        notification: payload.notification,
                    });
                });

                console.log("PAYLOAD: ", payload);
                messaging.sendEach(fcmMessages).then((result) => {
                    console.log(result.responses);
                });
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }

    /**
     * @description: Send Push Notification for WEB
     * @param {*} tokens
     * @param {*} payload
     */
    static async sendWebPushNotification(tokens, payload) {
        try {
            tokens = tokens.filter((value, index, array) => {
                array.indexOf(value) === index;
            });
            if (tokens.length > 0) {
                const messaging = admin.messaging();
                const fcmMessages = [];

                tokens.map((token) => {
                    fcmMessages.push({
                        token: token,
                        apns: {
                            payload: {
                                aps: {
                                    alert: payload.notification,
                                },
                            },
                        },
                        data: payload.data,
                        notification: {
                            title: payload.notification.title,
                            body: payload.notification.body,
                        },
                        webpush: {
                            notification: {
                                icon: logo(),
                                image: logo(),
                                click_action: payload.data.url,
                            },
                        },
                    });
                });

                console.log("WEB PAYLOAD", payload);
                messaging.sendEach(fcmMessages).then((result) => {
                    console.log(result.responses);
                });
            }
        } catch (error) {
            throw new BadRequestException(error);
        }
    }
}

export default fcmHelper;
