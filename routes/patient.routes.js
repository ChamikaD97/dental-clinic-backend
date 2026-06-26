import express from "express";
import patientController from "../controllers/patient.controller.js";

const router = express.Router();

router.post("/", patientController.createPatient);
router.get("/", patientController.getAllPatients);
router.get("/search", patientController.searchPatients);
router.get("/:id/history", patientController.getPatientHistory);
router.get("/:id", patientController.getPatientById);

export default router;