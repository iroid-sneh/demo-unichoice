import express from "express";
import asyncWrap from "express-async-wrapper";
import classesController from "./classes.controller";
import auth from "../common/middleware/auth";
const router = express.Router();

router.get("/", auth, asyncWrap(classesController.getClasses));

export default router;
