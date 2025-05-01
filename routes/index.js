import express from "express";
import adminRoutes from "../src/admin/admin.routes";
import apiRoutes from "./api";
const router = express.Router();

router.use("/api/v1", apiRoutes);

router.use("/admin", adminRoutes);

router.get("/admin", (req, res) => {
    return res.redirect("/admin/login");
});

router.use("/terms-and-conditions.pdf", async (req, res) => {
    return res.render("termsAndCondition/term&cond");
});

router.use("/privacy-policy.pdf", async (req, res) => {
    return res.render("termsAndCondition/policy");
});

export default router;
