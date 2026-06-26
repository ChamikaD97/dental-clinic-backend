import express from "express";

import patientRoutes from "./patient.routes.js";
import dentistRoutes from "./dentist.routes.js";
import appointmentRoutes from "./appointment.routes.js";
import treatmentRoutes from "./treatment.routes.js";
import paymentRoutes from "./payment.routes.js";
import reportRoutes from "./report.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Dental Clinic Backend is running",
  });
});

router.use("/patients", patientRoutes);
router.use("/dentists", dentistRoutes);
router.use("/appointments", appointmentRoutes);
router.use("/treatments", treatmentRoutes);
router.use("/payments", paymentRoutes);
router.use("/reports", reportRoutes);

export default router;