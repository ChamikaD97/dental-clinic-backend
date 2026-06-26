import appError from "../utils/appError.js";
import { readSheet, readSheets } from "../utils/excelDb.js";
export function getDailyAppointments(date) {
  if (!date) {
    throw appError("Date is required. Example: ?date=2026-06-26", 400);
  }

  const patients = readSheet("Patients");
  const dentists = readSheet("Dentists");
  const appointments = readSheet("Appointments");

  const dailyAppointments = appointments
    .filter((appointment) => appointment.appointment_date === date)
    .map((appointment) => {
      const patient = patients.find((p) => p.id === appointment.patient_id);
      const dentist = dentists.find((d) => d.id === appointment.dentist_id);

      return {
        appointment_id: appointment.id,
        time: appointment.appointment_time,
        patient_name: patient?.name || "",
        phone: patient?.phone || "",
        dentist_name: dentist?.name || "",
        reason_for_visit: appointment.reason_for_visit,
        status: appointment.status,
      };
    });

  return {
    date,
    total_appointments: dailyAppointments.length,
    data: dailyAppointments,
  };
}

export function getDailyIncome(date) {
  if (!date) {
    throw appError("Date is required. Example: ?date=2026-06-26", 400);
  }

  const patients = readSheet("Patients");
  const treatments = readSheet("Treatments");
  const payments = readSheet("Payments");

  const dailyPayments = payments
    .filter((payment) => payment.payment_date === date)
    .map((payment) => {
      const patient = patients.find((p) => p.id === payment.patient_id);
      const treatment = treatments.find((t) => t.id === payment.treatment_id);

      return {
        payment_id: payment.id,
        receipt_number: payment.receipt_number,
        patient_name: patient?.name || "",
        treatment: treatment?.treatment_performed || "",
        amount: Number(payment.payment_amount || 0),
        payment_method: payment.payment_method,
        payment_date: payment.payment_date,
        status: payment.status,
      };
    });

  const totalCash = dailyPayments
    .filter((payment) => payment.payment_method === "Cash")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const totalCard = dailyPayments
    .filter((payment) => payment.payment_method === "Card")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const totalTransfer = dailyPayments
    .filter((payment) => payment.payment_method === "Transfer")
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const totalIncome = dailyPayments.reduce(
    (sum, payment) => sum + Number(payment.amount || 0),
    0
  );

  return {
    date,
    summary: {
      total_cash: totalCash,
      total_card: totalCard,
      total_transfer: totalTransfer,
      total_income: totalIncome,
    },
    data: dailyPayments,
  };
}

export function getDailyNextAppointments(date) {
  if (!date) {
    throw appError("Date is required. Example: ?date=2026-07-03", 400);
  }

  const { Patients, Dentists, Treatments } = readSheets([
    "Patients",
    "Dentists",
    "Treatments",
  ]);

  const patientMap = new Map(Patients.map((patient) => [patient.id, patient]));
  const dentistMap = new Map(Dentists.map((dentist) => [dentist.id, dentist]));

  const dailyNextAppointments = Treatments
    .filter((treatment) => treatment.next_appointment_date === date)
    .map((treatment) => {
      const patient = patientMap.get(treatment.patient_id);
      const dentist = dentistMap.get(treatment.dentist_id);

      return {
        treatment_id: treatment.id,
        patient_id: treatment.patient_id,
        patient_name: patient?.name || "",
        phone: patient?.phone || "",
        age: patient?.age || "",
        gender: patient?.gender || "",
        address: patient?.address || "",
        dentist_id: treatment.dentist_id,
        dentist_name: dentist?.name || "",
        previous_appointment_id: treatment.appointment_id,
        previous_diagnosis: treatment.diagnosis,
        previous_treatment: treatment.treatment_performed,
        prescription: treatment.prescription,
        doctor_notes: treatment.doctor_notes,
        previous_treatment_date: treatment.treatment_date,
        next_appointment_date: treatment.next_appointment_date,
      };
    });

  return {
    date,
    total_next_appointments: dailyNextAppointments.length,
    data: dailyNextAppointments,
  };
}