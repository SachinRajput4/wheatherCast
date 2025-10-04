// routes/analyticsRoutes.js
import express from "express";
import { getSessionByMonth, getSessionByDate, getSessionDetail,getSessionDatesByMonth } from "../controllers/analyticsController.js";

const analyticsRouter = express.Router();

analyticsRouter.get('/session-analytics/month-summary', getSessionByMonth);      // ?collectionId=...&month=YYYY-MM
analyticsRouter.get('/session-analytics/date-summary', getSessionByDate);        // ?collectionId=...&date=YYYY-MM-DD
analyticsRouter.get('/session-analytics/session-summary', getSessionDetail);     // ?collectionId=...&date=YYYY-MM-DD&classOrder=1
analyticsRouter.get('/session-analytics/month-dates', getSessionDatesByMonth); // ?collectionId=...&month=YYYY-MM

export default analyticsRouter;
