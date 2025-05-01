import express from "express";
import asyncWrap from "express-async-wrapper";
import studyController from "./study.controller";
import storeFiles from "../../common/middleware/store-files";
const router = express.Router();

router.get("/", asyncWrap(studyController.studyPage));

router.get("/list", asyncWrap(studyController.studyCollegeList));

// Routes for Colleges for Study-materials
router.get("/addColleges", asyncWrap(studyController.addCollegesPage));

router.post(
    "/addColleges",
    storeFiles("public/study", "image", "single"),
    asyncWrap(studyController.addColleges)
);

router.get(
    "/updateColleges/:id",
    asyncWrap(studyController.updateCollegesPage)
);

router.post(
    "/updateColleges/:id",
    storeFiles("public/study", "image", "single"),
    asyncWrap(studyController.updateColleges)
);

router.get("/deleteColleges/:id", asyncWrap(studyController.deleteColleges));

//Routes for Study Materials of Colleges
router.get("/materials/:id", asyncWrap(studyController.materialsPage));

router.get("/materials-list/:id", asyncWrap(studyController.materialsList));

router.get("/addMaterials/:id", asyncWrap(studyController.addMaterialsPage));

router.post("/addMaterials/:id", asyncWrap(studyController.addMaterials));

router.get(
    "/updateMaterials/:id",
    asyncWrap(studyController.updateMaterialsPage)
);

router.post("/updateMaterials/:id", asyncWrap(studyController.updateMaterials));

router.get("/deleteMaterials/:id", asyncWrap(studyController.deleteMaterials));
export default router;
