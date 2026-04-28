import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import residentsRouter from "./residents";
import blotterRouter from "./blotter";
import projectsRouter from "./projects";
import announcementsRouter from "./announcements";
import ordinancesRouter from "./ordinances";
import documentsRouter from "./documents";
import assetsRouter from "./assets";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(residentsRouter);
router.use(blotterRouter);
router.use(projectsRouter);
router.use(announcementsRouter);
router.use(ordinancesRouter);
router.use(documentsRouter);
router.use(assetsRouter);

export default router;
