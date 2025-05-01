import express from "express";
import asyncWrap from "express-async-wrapper";
import forceUpdateController from "./forceUpdate.controller";
const router = express.Router();

router.get("/", asyncWrap(forceUpdateController.forceUpdate));

export default router;
