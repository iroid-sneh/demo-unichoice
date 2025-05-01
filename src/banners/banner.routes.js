import express from "express";
import asyncWrap from "express-async-wrapper";
import bannerController from "./banner.controller";
const router = express.Router();

router.get("/", asyncWrap(bannerController.getBanners));

export default router;
