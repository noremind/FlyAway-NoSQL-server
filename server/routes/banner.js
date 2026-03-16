import express from "express";
import { getBanner, createBanner} from "../controllers/bannerController.js"; 

export const bannerRoutes = express.Router();

bannerRoutes.get("/", getBanner);
bannerRoutes.post("/create", createBanner);



