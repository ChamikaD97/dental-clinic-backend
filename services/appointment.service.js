import { readSheet, writeSheet } from "../utils/excelDb.js";

import appError from "../utils/appError.js";
const APPOINTMENT_STATUSES = [
  "Pending",
  "Confirmed",
  "Checked In",
  "In Treatment",
  "Treatment Done",
  "Payment Pending",
  "Paid",
  "Completed",
  "Cancelled",
];
function getNow() {
  return new Date().toISOString();
}

export function createAppointment(data) {
  const appointments = readSheet("Appointments");

  if (!data.patient_id) {
    throw appError("Patient is required", 400);
  }

  if (!data.dentist_id) {
    throw appError("Dentist is required", 400);
  }

  if (!data.appointment_date) {
    throw appError("Appointment date is required", 400);
  }

  if (!data.appointment_time) {
    throw appError("Appointment time is required", 400);
  }

  const newId = `APP_${String(appointments.length + 1).padStart(4, "0")}`;

  const appointment = {
    id: newId,
    patient_id: data.patient_id,
    dentist_id: data.dentist_id,
    appointment_date: data.appointment_date,
    appointment_time: data.appointment_time,
    reason_for_visit: data.reason_for_visit || "",
    status: data.status || "Pending",
    created_at: getNow(),
    updated_at: getNow(),
  };

  appointments.push(appointment);
  writeSheet("Appointments", appointments);

  return appointment;
}

export function getAppointments(date) {
  const appointments = readSheet("Appointments");
  const patients = readSheet("Patients");
  const dentists = readSheet("Dentists");

  let filteredAppointments = appointments;

  if (date) {
    filteredAppointments = appointments.filter(
      (appointment) => appointment.appointment_date === date,
    );
  }

  return filteredAppointments.map((appointment, index) => {
    const patient = patients.find((p) => p.id === appointment.patient_id);
    const dentist = dentists.find((d) => d.id === appointment.dentist_id);

    return {
      queue_no: index + 1,
      appointment_id: appointment.id,
      id: appointment.id,
      patient_id: appointment.patient_id,
      patient_name: patient?.name || "",
      phone: patient?.phone || "",
      dentist_id: appointment.dentist_id,
      dentist_name: dentist?.name || "",
      appointment_date: appointment.appointment_date,
      appointment_time: appointment.appointment_time,
      reason_for_visit: appointment.reason_for_visit,
      status: appointment.status,
      created_at: appointment.created_at,
      updated_at: appointment.updated_at,
    };
  });
}
export function getAllAppointments() {
  const appointments = readSheet("Appointments");
  const patients = readSheet("Patients");
  const dentists = readSheet("Dentists");

  // Sort by date then time
  appointments.sort((a, b) => {
    if (a.appointment_date !== b.appointment_date) {
      return a.appointment_date.localeCompare(b.appointment_date);
    }

    return a.appointment_time.localeCompare(b.appointment_time);
  });

  // Queue counter for each day
  const queueMap = {};

  return appointments.map((appointment) => {
    const patient = patients.find((p) => p.id === appointment.patient_id);
    const dentist = dentists.find((d) => d.id === appointment.dentist_id);

    if (!queueMap[appointment.appointment_date]) {
      queueMap[appointment.appointment_date] = 1;
    }

    const queue_number = queueMap[appointment.appointment_date]++;

    return {
      ...appointment,
      queue_number,
      patient_name: patient?.name || "",
      phone: patient?.phone || "",
      dentist_name: dentist?.name || "",
    };
  });
}
export function updateAppointmentStatus(id, status) {
  const appointments = readSheet("Appointments");

  if (!id) {
    throw appError("Appointment ID is required", 400);
  }

  if (!status) {
    throw appError("Status is required", 400);
  }

  if (!APPOINTMENT_STATUSES.includes(status)) {
    throw appError(
      "Invalid status. Use Pending, Confirmed, Completed, or Cancelled",
      400,
    );
  }

  const index = appointments.findIndex((appointment) => appointment.id === id);

  if (index === -1) {
    throw appError("Appointment not found", 404);
  }

  appointments[index] = {
    ...appointments[index],
    status,
    updated_at: getNow(),
  };

  writeSheet("Appointments", appointments);

  return appointments[index];
}

export function updateAppointment(id, data) {
  const appointments = readSheet("Appointments");

  if (!id) {
    throw appError("Appointment ID is required", 400);
  }

  const index = appointments.findIndex((appointment) => appointment.id === id);

  if (index === -1) {
    throw appError("Appointment not found", 404);
  }

  if (data.status && !APPOINTMENT_STATUSES.includes(data.status)) {
    throw appError(
      "Invalid status. Use Pending, Confirmed, Completed, or Cancelled",
      400,
    );
  }

  appointments[index] = {
    ...appointments[index],

    patient_id: data.patient_id ?? appointments[index].patient_id,
    dentist_id: data.dentist_id ?? appointments[index].dentist_id,
    appointment_date:
      data.appointment_date ?? appointments[index].appointment_date,
    appointment_time:
      data.appointment_time ?? appointments[index].appointment_time,
    reason_for_visit:
      data.reason_for_visit ?? appointments[index].reason_for_visit,
    status: data.status ?? appointments[index].status,

    updated_at: getNow(),
  };

  writeSheet("Appointments", appointments);

  return appointments[index];
}

export function getAppointmentById(id) {
  const appointments = readSheet("Appointments");
  const patients = readSheet("Patients");
  const dentists = readSheet("Dentists");
  const treatments = readSheet("Treatments");

  const appointment = appointments.find((item) => item.id === id);

  if (!appointment) {
    throw appError("Appointment not found", 404);
  }

  const patient = patients.find((p) => p.id === appointment.patient_id);
  const dentist = dentists.find((d) => d.id === appointment.dentist_id);

  const treatment = treatments.find((treatment) => {
    const treatmentAppointmentId =
      treatment.appointment_id ||
      treatment.appointmentId ||
      treatment.appointmentID ||
      "";

    return (
      String(treatmentAppointmentId).trim() === String(appointment.id).trim()
    );
  });
  const sameDayAppointments = appointments
    .filter((item) => item.appointment_date === appointment.appointment_date)
    .sort((a, b) => {
      const timeA = a.appointment_time || "";
      const timeB = b.appointment_time || "";
      return timeA.localeCompare(timeB);
    });

  const queueIndex = sameDayAppointments.findIndex(
    (item) => item.id === appointment.id,
  );

  return {
    appointment_id: appointment.id,
    id: appointment.id,
    queue_no: queueIndex + 1,

    patient_id: appointment.patient_id,
    patient_name: patient?.name || "",
    phone: patient?.phone || "",
    age: patient?.age || "",
    gender: patient?.gender || "",
    address: patient?.address || "",

    treatment_id: treatment?.id || "",
    treatment_performed: treatment?.treatment_performed || "",

    diagnosis: treatment?.diagnosis || "",
    prescription: treatment?.prescription,
    next_appointment_date: treatment?.next_appointment_date,
    doctor_notes: treatment?.doctor_notes,
    dentist_id: appointment.dentist_id,
    dentist_name: dentist?.name || "",

    appointment_date: appointment.appointment_date,
    appointment_time: appointment.appointment_time,
    reason_for_visit: appointment.reason_for_visit,
    status: appointment.status,

    created_at: appointment.created_at,
    updated_at: appointment.updated_at,
  };
}
