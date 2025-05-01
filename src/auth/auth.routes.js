import express from "express";
import asyncWrap from "express-async-wrapper";
import authController from "./auth.controller";
import auth from "../common/middleware/auth";
import validator from "../common/config/joi-validator";
import profileDtos from "./dtos/profileDtos";
const router = express.Router();

router.post("/login", asyncWrap(authController.login));

router.post("/verify-otp", asyncWrap(authController.verifyEmail));

router.post("/resend-otp", asyncWrap(authController.resendOtp));

router.post(
    "/profile",
    auth,
    validator.body(profileDtos),
    asyncWrap(authController.profile)
);

router.get("/account-details", auth, asyncWrap(authController.accountDetails));

router.post("/logout", auth, asyncWrap(authController.logout));

router.delete("/delete-account", auth, asyncWrap(authController.deleteAccount));

export default router;
