import express from "express";
import appointmentController from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", appointmentController.createAppointment);
router.get("/", appointmentController.getAppointments);
router.patch("/:id/status", appointmentController.updateAppointmentStatus);

export default router;