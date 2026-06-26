import { readSheet, writeSheet } from "../utils/excelDb.js";
import { createId, now, today } from "../utils/helpers.js";
import appError from "../utils/appError.js";

export function createPayment(data) {
  const {
    patient_id,
    treatment_id,
    treatment_charge,
    payment_amount,
    payment_method,
    payment_date,
    receipt_number,
  } = data;

  if (!patient_id || !treatment_id || !payment_amount || !payment_method) {
    throw appError(
      "Patient, treatment, payment amount, and method are required",
      400
    );
  }

  const patients = readSheet("Patients");
  const patientExists = patients.some((patient) => patient.id === patient_id);

  if (!patientExists) {
    throw appError("Patient not found", 404);
  }

  const treatments = readSheet("Treatments");
  const treatmentExists = treatments.some(
    (treatment) => treatment.id === treatment_id
  );

  if (!treatmentExists) {
    throw appError("Treatment not found", 404);
  }

  const charge = Number(treatment_charge || 0);
  const amount = Number(payment_amount || 0);

  let status = "Unpaid";

  if (amount >= charge) {
    status = "Paid";
  } else if (amount > 0 && amount < charge) {
    status = "Partial";
  }

  const payments = readSheet("Payments");

  const newPayment = {
    id: createId("PAY"),
    patient_id,
    treatment_id,
    treatment_charge: charge,
    payment_amount: amount,
    payment_method,
    payment_date: payment_date || today(),
    receipt_number: receipt_number || "",
    status,
    created_at: now(),
    updated_at: now(),
  };

  payments.push(newPayment);
  writeSheet("Payments", payments);

  return newPayment;
}

export function getPayments(filters) {
  const { patient_id, date } = filters;

  let payments = readSheet("Payments");

  if (patient_id) {
    payments = payments.filter((payment) => payment.patient_id === patient_id);
  }

  if (date) {
    payments = payments.filter((payment) => payment.payment_date === date);
  }

  return payments;
}