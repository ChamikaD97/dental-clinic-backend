import * as patientService from "../services/patient.service.js";
import sendError from "../utils/sendError.js";

function createPatient(req, res) {
  try {
    const patient = patientService.createPatient(req.body);

    res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      data: patient,
    });
  } catch (error) {
    sendError(res, error, "Failed to register patient");
  }
}

function getAllPatients(req, res) {
  try {
    const patients = patientService.getAllPatients();

    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch patients");
  }
}

function searchPatients(req, res) {
  try {
    const patients = patientService.searchPatients(req.query.q);

    res.json({
      success: true,
      data: patients,
    });
  } catch (error) {
    sendError(res, error, "Patient search failed");
  }
}

function getPatientById(req, res) {
  try {
    const patient = patientService.getPatientById(req.params.id);

    res.json({
      success: true,
      data: patient,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch patient");
  }
}

function getPatientHistory(req, res) {
  try {
    const history = patientService.getPatientHistory(req.params.id);

    res.json({
      success: true,
      data: history,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch patient history");
  }
}

export default {
  createPatient,
  getAllPatients,
  searchPatients,
  getPatientById,
  getPatientHistory,
};