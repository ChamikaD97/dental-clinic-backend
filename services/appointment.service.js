import { readSheet, writeSheet } from "../utils/excelDb.js";
import { createId, now } from "../utils/helpers.js";
import appError from "../utils/appError.js";

export function createAppointment(data) {
  const {
    patient_id,
    dentist_id,
    appointment_date,
    appointment_time,
    reason_for_visit,
  } = data;

  if (!patient_id || !appointment_date || !appointment_time) {
    throw appError(
      "Patient, appointment date, and appointment time are required",
      400
    );
  }

  const patients = readSheet("Patients");
  const patientExists = patients.some((patient) => patient.id === patient_id);

  if (!patientExists) {
    throw appError("Patient not found", 404);
  }

  if (dentist_id) {
    const dentists = readSheet("Dentists");
    const dentistExists = dentists.some((dentist) => dentist.id === dentist_id);

    if (!dentistExists) {
      throw appError("Dentist not found", 404);
    }
  }

  const appointments = readSheet("Appointments");

  const newAppointment = {
    id: createId("APP"),
    patient_id,
    dentist_id: dentist_id || "",
    appointment_date,
    appointment_time,
    reason_for_visit: reason_for_visit || "",
    status: "Pending",
    created_at: now(),
    updated_at: now(),
  };

  appointments.push(newAppointment);
  writeSheet("Appointments", appointments);

  return newAppointment;
}

export function getAppointments(date) {
  let appointments = readSheet("Appointments");

  if (date) {
    appointments = appointments.filter(
      (appointment) => appointment.appointment_date === date
    );
  }

  return appointments;
}

export function updateAppointmentStatus(id, status) {
  const allowedStatuses = ["Pending", "Completed", "Cancelled"];

  if (!allowedStatuses.includes(status)) {
    throw appError("Invalid appointment status", 400);
  }

  const appointments = readSheet("Appointments");

  const index = appointments.findIndex((appointment) => appointment.id === id);

  if (index === -1) {
    throw appError("Appointment not found", 404);
  }

  appointments[index].status = status;
  appointments[index].updated_at = now();

  writeSheet("Appointments", appointments);

  return appointments[index];
}