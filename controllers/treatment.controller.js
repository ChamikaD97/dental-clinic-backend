import * as treatmentService from "../services/treatment.service.js";
import sendError from "../utils/sendError.js";

function createTreatment(req, res) {
  try {
    const treatment = treatmentService.createTreatment(req.body);

    res.status(201).json({
      success: true,
      message: "Treatment recorded successfully",
      data: treatment,
    });
  } catch (error) {
    sendError(res, error, "Failed to record treatment");
  }
}

function getTreatments(req, res) {  
  try {
    const treatments = treatmentService.getTreatments(req.query.patient_id);

    res.json({
      success: true,
      data: treatments,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch treatments");
  }
}

export default {
  createTreatment,
  getTreatments,
};