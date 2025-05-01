import express from "express";
import asyncwrap from "express-async-wrapper";
import adminAuth from "../common/middleware/adminAuth";
import adminController from "./admin.controller";
import classesRoutes from "./myClasses/classes.routes";
import studyRoutes from "./Study/study.routes";
import collegesRoutes from "./colleges/colleges.routes";
import updateRoutes from "./updates/updates.routes";
import applicationsRoutes from "./student/applications.routes";
import bannersRoutes from "./banners/banners.routes";
const router = express.Router();

router.get("/login", asyncwrap(adminController.loginPage));

router.post("/login", asyncwrap(adminController.login));

router.get("/dashboard", adminAuth, asyncwrap(adminController.dashboard));

router.get(
    "/change-password",
    adminAuth,
    asyncwrap(adminController.changePasswordPage)
);

router.post(
    "/change-password",
    adminAuth,
    asyncwrap(adminController.changePassword)
);

router.get("/logout", adminAuth, asyncwrap(adminController.logout));

router.use("/myClasses", adminAuth, classesRoutes);

router.use("/study-materials", adminAuth, studyRoutes);

router.use("/colleges", adminAuth, collegesRoutes);

router.use("/updates", adminAuth, updateRoutes);

router.use("/student-applications", adminAuth, applicationsRoutes);

router.use("/banners", adminAuth, bannersRoutes);

export default router;
