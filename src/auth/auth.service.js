import User from "../../models/user";
import commonService from "../../utils/common.service";
import authHelper from "../common/auth.helper";
import {
    BadRequestException,
    NotFoundException,
    PreconditionFailedException,
    UnauthorizedException,
} from "../common/error-exception";
import { randomNumberGenerator } from "../common/helper";
import userResources from "./resources/userResources";
import sendMail from "../common/middleware/sendMail";
import AccessToken from "../../models/accessToken";
import RefreshToken from "../../models/RefreshToken";
const expiresInSeconds = 31536000;

class authServices {
    /**
     * @description: Login For Users
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async login(data, req, res) {
        const { email } = data;

        if (!email) {
            throw new PreconditionFailedException("Email is Required");
        }

        const otp = randomNumberGenerator(6);
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

        const findUser = await commonService.findOne(User, { email });

        const obj = {
            to: email,
            subject: `Welcome to ${process.env.APP_NAME}`,
            data: { otp },
        };

        // sendMail(obj, "emailVerification");
        if (!findUser) {
            await commonService.createOne(User, {
                email: email,
                otp: otp,
                otpExpires: otpExpires,
            });
        } else {
            await commonService.findOneAndUpdate(
                User,
                { email },
                {
                    $set: { otp, otpExpires: otpExpires },
                }
            );
        }
        return res.status(200).json({
            data: obj,
            message: "OTP sent Successfully",
        });
    }

    /**
     * @description: Verify Mail With OTP
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async verifyEmail(data, req, res) {
        const { email, otp } = data;

        if (!email || !otp) {
            throw new PreconditionFailedException("Email and OTP is required");
        }

        let findUser = await commonService.findOne(User, { email });

        if (!findUser) {
            throw new NotFoundException("User not Found with this Mail");
        }

        if (
            !findUser ||
            findUser.otp != otp ||
            findUser.otpExpires < Date.now()
        ) {
            throw new BadRequestException("Expired or Invalid OTP");
        } else {
            await commonService.updateById(
                User,
                { _id: findUser._id },
                {
                    otp: null,
                    otpExpires: null,
                }
            );
        }

        const tokens = await authHelper.tokensGenerator(findUser._id);

        if (findUser.isProfileCompleted) {
            return res.send({
                message: "Login successfully",
                data: {
                    tokenType: "Bearer",
                    accessToken: tokens.accessToken,
                    refereshToken: tokens.refreshToken,
                    expiresIn: expiresInSeconds,
                    isProfileCompleted: true,
                },
            });
        } else {
            return res.send({
                message: "OTP verified successfully",
                data: {
                    tokenType: "Bearer",
                    accessToken: tokens.accessToken,
                    refereshToken: tokens.refreshToken,
                    expiresIn: expiresInSeconds,
                    isProfileCompleted: false,
                },
            });
        }
    }

    /**
     * @description: Resend OTP
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async resendOtp(data, req, res) {
        try {
            const { email } = data;

            if (!email) {
                throw new PreconditionFailedException("Email is Required");
            }

            const findUser = await commonService.findOne(User, { email });

            if (!findUser) {
                throw new NotFoundException("User not Found with this Mail");
            }

            const otp = randomNumberGenerator(6);
            const otpExpires = new Date(Date.now() + 2 * 60 * 1000);

            await commonService.updateById(
                User,
                { _id: findUser._id },
                {
                    otp: otp,
                    otpExpires: otpExpires,
                }
            );

            return res.status(200).send({
                success: true,
                message: "OTP sent Successfully",
                data: {
                    otp,
                },
            });
        } catch (error) {
            console.error("Error", error);
            return res.status(500).send({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    /**
     * @description: Compelete Profile
     * @param {*} data
     * @param {*} req
     * @param {*} res
     */
    static async profile(data, req, res) {
        const { fullName, phoneNumber } = data;
        const userId = req.user.userId;
        // console.log(userId);
        if (!fullName || !phoneNumber) {
            throw new PreconditionFailedException(
                "FullName and Phone Number is Required"
            );
        }

        const findUser = await commonService.findById(User, { _id: userId });

        if (!findUser) {
            throw new BadRequestException("User not Found");
        }

        const profile = await commonService.updateById(
            User,
            { _id: userId },
            {
                ...data,
                countryCode: "+91",
                phoneNumber,
                fullName,
                isProfileCompleted: true,
            }
        );

        return res.send({
            message: "Profile Completed Successfully",
            data: new userResources(profile),
        });
    }

    /**
     * @description: Users Account Details
     * @param {*} req
     * @param {*} res
     */
    static async accountDetails(req, res) {
        const userId = req.user.userId;

        const findUser = await commonService.findById(User, { _id: userId });
        if (!findUser) {
            throw new BadRequestException("User not Found");
        }

        const userDetails = {
            fullName: findUser.fullName,
            phoneNumber: findUser.phoneNumber,
            email: findUser.email,
        };

        return res.send({
            data: userDetails,
        });
    }

    /**
     * @description: Logout Users
     * @param {*} req
     * @param {*} res
     */
    static async logout(req, res) {
        const userId = req.user.userId;
        try {
            const { deviceId } = req.body;
            if (deviceId) {
                // Delete Firebase Cloud Messaging IDs
            }
            const availableToken = await commonService.findOne(AccessToken, {
                token: req.user.jti,
            });

            if (!availableToken) {
                throw new BadRequestException("Invalid or Expired Token");
            }

            await commonService.findOneAndDelete(RefreshToken, {
                jti: req.user.jti,
            });
            await commonService.deleteById(AccessToken, availableToken._id);

            return res.status(200).send({
                success: true,
                message: "Logged out Successfully",
            });
        } catch (error) {
            console.error("Error", error);
            return res.status(500).send({
                success: false,
                message: "Internal Server Error",
            });
        }
    }

    /**
     * @description: Delete User Account
     * @param {*} req
     * @param {*} res
     */
    static async deleteAccount(req, res) {
        try {
            const userId = req.user?.userId;

            if (!userId) {
                throw new UnauthorizedException("Unauhorized");
            }

            const findUser = await commonService.findById(User, {
                _id: userId,
            });
            if (!findUser) {
                throw new BadRequestException("User not Found");
            }

            const accssToken = await commonService.findOne(AccessToken, {
                userId,
            });

            if (accssToken.length > 0) {
                const jtiList = accssToken.map((token) => token.token);

                await commonService.deleteMany(RefreshToken, {
                    jti: { $in: jtiList },
                });

                await commonService.deleteMany(AccessToken, { userId });
            }

            await commonService.deleteOne(User, { userId });

            return res.status(200).send({
                success: true,
                message: "Account Deleted Successfully",
            });
        } catch (error) {
            console.error("Error", error);
            return res.status(500).send({
                success: false,
                message: "Internal Server Error",
                error: error.message,
            });
        }
    }
}

export default authServices;
