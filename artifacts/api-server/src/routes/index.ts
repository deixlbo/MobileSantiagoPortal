import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiRouter from "./openai";
import announcementsRouter from "./barangay/announcements";
import ordinancesRouter from "./barangay/ordinances";
import documentsRouter from "./barangay/documents";
import blotterRouter from "./barangay/blotter";
import projectsRouter from "./barangay/projects";
import residentsRouter from "./barangay/residents";
import assetsRouter from "./barangay/assets";
import usersRouter from "./barangay/users";
import businessesRouter from "./barangay/businesses";
import seedRouter from "./barangay/seed-route";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/openai", openaiRouter);
router.use("/announcements", announcementsRouter);
router.use("/ordinances", ordinancesRouter);
router.use("/documents", documentsRouter);
router.use("/blotter", blotterRouter);
router.use("/projects", projectsRouter);
router.use("/residents", residentsRouter);
router.use("/assets", assetsRouter);
router.use("/users", usersRouter);
router.use("/businesses", businessesRouter);
router.use("/admin", seedRouter);

export default router;
