import express from "express";
import asyncWrap from "express-async-wrapper";
import collegesController from "./colleges.controller";
import auth from "../common/middleware/auth";
const router = express.Router();

router.get("/", auth, asyncWrap(collegesController.collegesList));

router.post("/apply", auth, asyncWrap(collegesController.applyToColleges));

router.post("/interested", auth, asyncWrap(collegesController.interested));

router.get(
    "/preference-list",
    auth,
    asyncWrap(collegesController.preferenceList)
);

router.get("/rank", auth, asyncWrap(collegesController.rank));

router.get(
    "/rank-option-list",
    auth,
    asyncWrap(collegesController.rankOptions)
);

export default router;
