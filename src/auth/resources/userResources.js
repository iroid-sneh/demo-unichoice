class userResources {
    constructor(data) {
        return {
            _id: data._id,
            fullName: data.fullName,
            email: data.email,
            countryCode: data.countryCode,
            phoneNumber: data.phoneNumber,
            isProfileCompleted: data.isProfileCompleted,
        };
    }
}

export default userResources;
