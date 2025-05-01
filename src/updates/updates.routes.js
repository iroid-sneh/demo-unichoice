import express from "express";
import asyncWrap from "express-async-wrapper";
import updatesController from "./updates.controller";
import auth from "../common/middleware/auth";
const router = express.Router();

router.get("/college", auth, asyncWrap(updatesController.getUpdates));

router.get("/tags", auth, asyncWrap(updatesController.tags));

router.get(
    "/college-update",
    auth,
    asyncWrap(updatesController.collegeUpdatesList)
);

export default router;
