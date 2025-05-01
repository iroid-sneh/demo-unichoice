import express from "express";
import asyncWrap from "express-async-wrapper";
import storeFiles from "../../common/middleware/store-files";
import classesController from "./classes.controller";
const router = express.Router();

router.get("/", asyncWrap(classesController.classesPage));

router.get("/list", asyncWrap(classesController.classesList));

router.get("/addClasses", asyncWrap(classesController.addClassesPage));

router.post(
    "/addClasses",
    storeFiles("public/myClasses", "image", "single"),
    asyncWrap(classesController.addClasses)
);

router.get("/updateClasses/:id", asyncWrap(classesController.updateClassPage));

router.post(
    "/updateClasses/:id",
    storeFiles("public/myClasses", "image", "single"),
    asyncWrap(classesController.updateClasses)
);

router.get("/delete/:id", asyncWrap(classesController.deleteClasses));

export default router;
