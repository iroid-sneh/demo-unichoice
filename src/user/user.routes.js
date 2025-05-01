import express from "express";
import userController from "./user.controller";
import asyncWrap from "express-async-wrapper";
import auth from "../common/middleware/auth";
const router = express.Router();

router.get(
    "/terms-and-conditions",
    auth,
    asyncWrap(userController.termsAndConditions)
);

export default router;
