import express from "express";
import appointmentController from "../controllers/appointment.controller.js";

const router = express.Router();

router.post("/", appointmentController.createAppointment);
router.get("/", appointmentController.getAppointments);

// get single appointment
router.get("/:id", appointmentController.getAppointmentById);

// status update
router.patch("/:id/status", appointmentController.updateAppointmentStatus);

// full update
router.patch("/:id", appointmentController.updateAppointment);

export default router;