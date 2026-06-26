import express from "express";
import dentistController from "../controllers/dentist.controller.js";

const router = express.Router();

router.post("/", dentistController.createDentist);
router.get("/", dentistController.getAllDentists);

export default router;