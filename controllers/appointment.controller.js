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

function getAppointmentById(req, res) {
  try {
    const appointment = appointmentService.getAppointmentById(req.params.id);

    res.json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    sendError(res, error, "Failed to fetch appointment");
  }
}

function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = appointmentService.updateAppointmentStatus(id, status);

    res.json({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    sendError(res, error, "Failed to update appointment status");
  }
}

function updateAppointment(req, res) {
  try {
    const { id } = req.params;

    const appointment = appointmentService.updateAppointment(id, req.body);

    res.json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    sendError(res, error, "Failed to update appointment");
  }
}

export default {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateAppointment,
};