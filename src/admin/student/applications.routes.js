import express from "express";
import asyncWrap from "express-async-wrapper";
import applicationsController from "./applications.controller";
const router = express.Router();

router.get("/", asyncWrap(applicationsController.applicationPage));

router.get("/list", asyncWrap(applicationsController.collegeList));

router.get("/students/:id", asyncWrap(applicationsController.studentsListPage));

router.get(
    "/students/list/:id",
    asyncWrap(applicationsController.studentsList)
);
export default router;
