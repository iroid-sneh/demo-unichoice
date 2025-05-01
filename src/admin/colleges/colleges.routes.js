import express from "express";
import asyncWrap from "express-async-wrapper";
import storeFiles from "../../common/middleware/store-files";
import collegeController from "./colleges.controller";
const router = express.Router();

router.get("/", asyncWrap(collegeController.collegesPage));

router.get("/list", asyncWrap(collegeController.collegeList));

router.get("/addColleges", asyncWrap(collegeController.addCollegesPage));

router.post(
    "/addColleges",
    storeFiles("public/colleges", "image", "single"),
    asyncWrap(collegeController.addColleges)
);

router.get(
    "/checkCollegesIndex",
    asyncWrap(collegeController.checkCollegesIndex)
);

router.get("/deleteColleges/:id", asyncWrap(collegeController.deleteColleges));

router.get(
    "/updateColleges/:id",
    asyncWrap(collegeController.updateCollegesPage)
);

router.post(
    "/updateColleges/:id",
    storeFiles("public/colleges", "image", "single"),
    asyncWrap(collegeController.updateColleges)
);

// COLLEGE UPDATES ROUTES
router.get(
    "/updates/view-images-videos/:id",
    asyncWrap(collegeController.viewUpdatesImages)
);

router.get("/updates/:id", asyncWrap(collegeController.collegeUpdates));

router.get(
    "/updates/list/:id",
    asyncWrap(collegeController.collegeUpdatesList)
);

router.get("/addUpdates/:id", asyncWrap(collegeController.addUpdatesPage));

router.post(
    "/addUpdates/:id",
    storeFiles("public/updates", "mediaFiles", "array"),
    asyncWrap(collegeController.addUpdates)
);

router.get("/editUpdate/:id", asyncWrap(collegeController.editUpdatesPage));

router.post(
    "/editUpdate/:id",
    storeFiles("public/updates", "mediaFiles", "array"),
    asyncWrap(collegeController.editUpdates)
);

router.delete("/deleteImage/:id", asyncWrap(collegeController.deleteImage));

router.delete("/deleteUpdate/:id", asyncWrap(collegeController.deleteUpdates));

export default router;
