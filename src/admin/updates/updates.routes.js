import express from "express";
import asyncWrap from "express-async-wrapper";
import updateController from "./updates.controller";
import storeFiles from "../../common/middleware/store-files";
const router = express.Router();

router.get("/", asyncWrap(updateController.TagPage));

router.get("/tagList", asyncWrap(updateController.tagList));

router.post("/addTag", asyncWrap(updateController.addTag));

router.post("/updateTag/:id", asyncWrap(updateController.updateTag));

router.post("/deleteTag/:id", asyncWrap(updateController.deleteTag));

// ADD UPDATES TO TAGS THAT ARE CREATED
router.get("/tagUpdates/:id", asyncWrap(updateController.TagUpdatesPage));

router.get("/tagUpdates/list/:id", asyncWrap(updateController.tagUpdatesList));

router.get("/addUpdates/:id", asyncWrap(updateController.addUpdatesPage));

router.post(
    "/addUpdates/:id",
    storeFiles("public/updates", "mediaFiles", "array"),
    asyncWrap(updateController.addUpdates)
);

router.get("/editUpdate/:id", asyncWrap(updateController.editUpdatesPage));

router.post(
    "/editUpdate/:id",
    storeFiles("public/updates", "mediaFiles", "array"),
    asyncWrap(updateController.editUpdates)
);

router.post("/deleteUpdate/:id", asyncWrap(updateController.deleteUpdates));

export default router;
