import { readSheet, writeSheet } from "../utils/excelDb.js";
import { createId, now } from "../utils/helpers.js";
import appError from "../utils/appError.js";

export function createPatient(data) {
  const { name, phone, age, gender, address } = data;

  if (!name || !phone) {
    throw appError("Patient name and phone number are required", 400);
  }

  const patients = readSheet("Patients");

  const newPatient = {
    id: createId("PAT"),
    name,
    phone,
    age: age || "",
    gender: gender || "",
    address: address || "",
    created_at: now(),
    updated_at: now(),
  };

  patients.push(newPatient);
  writeSheet("Patients", patients);

  return newPatient;
}

export function getAllPatients() {
  return readSheet("Patients");
}

export function searchPatients(q) {
  const patients = readSheet("Patients");

  if (!q) {
    return patients;
  }

  const keyword = q.toLowerCase();

  return patients.filter((patient) => {
    return (
      String(patient.name).toLowerCase().includes(keyword) ||
      String(patient.phone).toLowerCase().includes(keyword)
    );
  });
}

export function getPatientById(id) {
  const patients = readSheet("Patients");
  const patient = patients.find((p) => p.id === id);

  if (!patient) {
    throw appError("Patient not found", 404);
  }

  return patient;
}

export function getPatientHistory(patientId) {
  const patients = readSheet("Patients");
  const appointments = readSheet("Appointments");
  const treatments = readSheet("Treatments");
  const payments = readSheet("Payments");

  const patient = patients.find((p) => p.id === patientId);

  if (!patient) {
    throw appError("Patient not found", 404);
  }

  const patientAppointments = appointments.filter(
    (appointment) => appointment.patient_id === patientId
  );

  const patientTreatments = treatments.filter(
    (treatment) => treatment.patient_id === patientId
  );

  const patientPayments = payments.filter(
    (payment) => payment.patient_id === patientId
  );

  return {
    personal_information: patient,
    appointment_history: patientAppointments,
    treatment_history: patientTreatments,
    prescription_history: patientTreatments.map((treatment) => ({
      treatment_id: treatment.id,
      prescription: treatment.prescription,
      treatment_date: treatment.treatment_date,
    })),
    payment_history: patientPayments,
    doctor_notes: patientTreatments.map((treatment) => ({
      treatment_id: treatment.id,
      doctor_notes: treatment.doctor_notes,
      treatment_date: treatment.treatment_date,
    })),
  };
}