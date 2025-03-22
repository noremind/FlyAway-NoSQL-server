import express from "express";
import { getAds } from "../controllers/adController.js"; 

const adRoutes = express.Router();

adRoutes.get("/", getAds);

export default adRoutes;
