module.exports = {
    baseUrl(path = null) {
        let url = `${process.env.BASE_URL}:${process.env.PORT}`;
        if (process.env.ENV !== "production") {
            url = `${process.env.BASE_URL}:${process.env.PORT}`;
        }
        return url + (path ? `/${path}` : "");
    },

    apiBaseUrl(path = null) {
        let url = `${process.env.BASE_URL}:${process.env.PORT}/api/v1`;
        if (process.env.ENV !== "production") {
            url = `${process.env.BASE_URL}:${process.env.PORT}/api/v1`;
        }
        return url + (path ? `/${path}` : "");
    },

    BCRYPT: {
        SALT_ROUND: 12,
    },

    JWT: {
        SECRET: "unichoice76",
        EXPIRES_IN: "1 YEAR",
    },

    PLATFORM: {
        ANDROID: "Android",
        IOS: "iOS",
    },
};
