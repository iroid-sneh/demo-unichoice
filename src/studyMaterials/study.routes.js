import express from "express";
import asyncWrap from "express-async-wrapper";
import studyController from "./study.controller";
const router = express.Router();

router.get("/", asyncWrap(studyController.collegeList));

router.get("/materials/:id", asyncWrap(studyController.getMaterials));

export default router;
