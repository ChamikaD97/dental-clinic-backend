import * as dentistService from "../services/dentist.service.js";
import sendError from "../utils/sendError.js";

function createDentist(req, res) {
  try {
    const dentist = dentistService.createDentist(req.body);

    res.status(201).json({
      success: true,
      message: "Dentist added successfully",
      data: dentist,
    });
  } catch (error) {
    sendError(res, error, "Failed to add dentist");
  }
}

function getAllDentists(req, res) {
  try {
    const dentists = dentistService.getAllDentists();

    res.json({
      success: true,
      data: dentists,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch dentists");
  }
}

export default {
  createDentist,
  getAllDentists,
};