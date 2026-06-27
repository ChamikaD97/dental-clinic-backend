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

export function updatePatient(id, data) {
  const patients = readSheet("Patients");

  const index = patients.findIndex((patient) => patient.id === id);

  if (index === -1) {
    throw appError("Patient not found", 404);
  }

  const existingPatient = patients[index];

  patients[index] = {
    ...existingPatient,
    name: data.name ?? existingPatient.name,
    phone: data.phone ?? existingPatient.phone,
    age: data.age ?? existingPatient.age,
    gender: data.gender ?? existingPatient.gender,
    address: data.address ?? existingPatient.address,
    updated_at: now(),
  };

  writeSheet("Patients", patients);

  return patients[index];
}

export function deletePatient(id) {
  const patients = readSheet("Patients");

  const index = patients.findIndex((patient) => patient.id === id);

  if (index === -1) {
    throw appError("Patient not found", 404);
  }

  const deletedPatient = patients[index];

  patients.splice(index, 1);
  writeSheet("Patients", patients);

  return deletedPatient;
}

export function getPatientStatistics() {
  const patients = readSheet("Patients");

  const totalPatients = patients.length;

  const malePatients = patients.filter(
    (patient) => String(patient.gender).toLowerCase() === "male"
  ).length;

  const femalePatients = patients.filter(
    (patient) => String(patient.gender).toLowerCase() === "female"
  ).length;

  const totalAge = patients.reduce((sum, patient) => {
    const age = Number(patient.age) || 0;
    return sum + age;
  }, 0);

  const averageAge =
    totalPatients > 0 ? Number((totalAge / totalPatients).toFixed(1)) : 0;

  return {
    total_patients: totalPatients,
    male_patients: malePatients,
    female_patients: femalePatients,
    average_age: averageAge,
  };
}

export function getRecentPatients() {
  const patients = readSheet("Patients");

  return patients
    .sort((a, b) => Number(b.created_at) - Number(a.created_at))
    .slice(0, 5);
}