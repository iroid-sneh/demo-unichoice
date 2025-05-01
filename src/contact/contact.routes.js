import express from "express";
import asyncWrap from "express-async-wrapper";
import contactController from "./contact.controller";
import auth from "../common/middleware/auth";
const router = express.Router();

router.post("/", auth, asyncWrap(contactController.contactForm));

export default router;
