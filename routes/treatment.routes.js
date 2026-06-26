import express from "express";
import treatmentController from "../controllers/treatment.controller.js";

const router = express.Router();

router.post("/", treatmentController.createTreatment);
router.get("/", treatmentController.getTreatments);

export default router;