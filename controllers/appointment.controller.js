import * as appointmentService from "../services/appointment.service.js";
import sendError from "../utils/sendError.js";

function createAppointment(req, res) {
  try {
    const appointment = appointmentService.createAppointment(req.body);

    res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      data: appointment,
    });
  } catch (error) {
    sendError(res, error, "Failed to book appointment");
  }
}

function getAppointments(req, res) {
  try {
    const appointments = appointmentService.getAppointments(req.query.date);

    res.json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch appointments");
  }
}

function updateAppointmentStatus(req, res) {
  try {
    const appointment = appointmentService.updateAppointmentStatus(
      req.params.id,
      req.body.status
    );

    res.json({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    sendError(res, error, "Failed to update appointment status");
  }
}

export default {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
};