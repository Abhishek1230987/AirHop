import express from "express";
import { getAQI } from "../controllers/aqiController.js";

const router = express.Router();
router.get("/:city", getAQI);
export default router;
