import express from "express";
import asyncWrap from "express-async-wrapper";
import bannersController from "./banners.controller";
import storeFiles from "../../common/middleware/store-files";
const router = express.Router();

router.get("/", asyncWrap(bannersController.bannersPage));

router.get("/list", asyncWrap(bannersController.bannersList));

router.get("/addBanners", asyncWrap(bannersController.addBannersPage));

router.post(
    "/addBanners",
    storeFiles("public/banners", "image", "single"),
    asyncWrap(bannersController.addBanners)
);

router.get("/deleteBanner/:id", asyncWrap(bannersController.deleteBanner));

export default router;
