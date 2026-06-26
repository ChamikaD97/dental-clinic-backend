import * as reportService from "../services/report.service.js";
import sendError from "../utils/sendError.js";

function getDailyAppointments(req, res) {
  try {
    const report = reportService.getDailyAppointments(req.query.date);

    res.json({
      success: true,
      ...report,
    });
  } catch (error) {
    sendError(res, error, "Failed to generate daily appointment report");
  }
}

function getDailyIncome(req, res) {
  try {
    const report = reportService.getDailyIncome(req.query.date);

    res.json({
      success: true,
      ...report,
    });
  } catch (error) {
    sendError(res, error, "Failed to generate daily income report");
  }
}

function getDailyNextAppointments(req, res) {
  try {
    console.log("[Controller] Query Date:", req.query.date);

    const report = reportService.getDailyNextAppointments(req.query.date);

    res.json({
      success: true,
      ...report,
    });
  } catch (error) {
    sendError(res, error, "Failed to generate daily next appointment report");
  }
}

export default {
  getDailyAppointments,
  getDailyIncome,
  getDailyNextAppointments,
};