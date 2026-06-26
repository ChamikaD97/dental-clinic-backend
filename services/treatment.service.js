import { readSheet, writeSheet } from "../utils/excelDb.js";
import { createId, now, today } from "../utils/helpers.js";
import appError from "../utils/appError.js";

export function createTreatment(data) {
  const {
    patient_id,
    appointment_id,
    dentist_id,
    diagnosis,
    treatment_performed,
    prescription,
    doctor_notes,
    next_appointment_date,
    treatment_date,
  } = data;

  if (!patient_id || !appointment_id || !diagnosis || !treatment_performed) {
    throw appError(
      "Patient, appointment, diagnosis, and treatment performed are required",
      400
    );
  }

  const patients = readSheet("Patients");
  const patientExists = patients.some((patient) => patient.id === patient_id);

  if (!patientExists) {
    throw appError("Patient not found", 404);
  }

  const appointments = readSheet("Appointments");
  const appointmentIndex = appointments.findIndex(
    (appointment) => appointment.id === appointment_id
  );

  if (appointmentIndex === -1) {
    throw appError("Appointment not found", 404);
  }

  const treatments = readSheet("Treatments");

  const newTreatment = {
    id: createId("TRT"),
    patient_id,
    appointment_id,
    dentist_id: dentist_id || "",
    diagnosis,
    treatment_performed,
    prescription: prescription || "",
    doctor_notes: doctor_notes || "",
    next_appointment_date: next_appointment_date || "",
    treatment_date: treatment_date || today(),
    created_at: now(),
    updated_at: now(),
  };

  treatments.push(newTreatment);
  writeSheet("Treatments", treatments);

  appointments[appointmentIndex].status = "Completed";
  appointments[appointmentIndex].updated_at = now();
  writeSheet("Appointments", appointments);

  return newTreatment;
}

export function getTreatments(patient_id) {
  let treatments = readSheet("Treatments");

  if (patient_id) {
    treatments = treatments.filter(
      (treatment) => treatment.patient_id === patient_id
    );
  }

  return treatments;
}