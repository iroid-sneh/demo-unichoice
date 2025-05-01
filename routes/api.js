import express from "express";
import authRoutes from "../src/auth/auth.routes";
import userRoutes from "../src/user/user.routes";
import classesRoutes from "../src/classes/classes.routes";
import studyCollegeRoutes from "../src/studyMaterials/study.routes";
import updateRoutes from "../src/updates/updates.routes";
import collegesRoutes from "../src/colleges/colleges.routes";
import bannerRoutes from "../src/banners/banner.routes";
import contactRoutes from "../src/contact/contact.routes";
import forceUpdateRoutes from "../src/forceUpdate/forceUpdate.routes";
const router = express.Router();

router.use("/auth", authRoutes);

router.use("/user", userRoutes);

router.use("/classes", classesRoutes);

router.use("/study-college", studyCollegeRoutes);

router.use("/colleges", collegesRoutes);

router.use("/updates", updateRoutes);

router.use("/banner", bannerRoutes);

// router.use("/contact", contactRoutes);

router.use("/force-update", forceUpdateRoutes);

export default router;
