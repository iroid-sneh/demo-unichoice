import Joi from "joi";

export default Joi.object().keys({
    phoneNumber: Joi.string().required(),
    fullName: Joi.string().required(),
});
