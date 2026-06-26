import { readSheet, writeSheet } from "../utils/excelDb.js";
import { createId, now } from "../utils/helpers.js";
import appError from "../utils/appError.js";

export function createDentist(data) {
  const { name, phone, specialization } = data;

  if (!name) {
    throw appError("Dentist name is required", 400);
  }

  const dentists = readSheet("Dentists");

  const newDentist = {
    id: createId("DEN"),
    name,
    phone: phone || "",
    specialization: specialization || "",
    created_at: now(),
    updated_at: now(),
  };

  dentists.push(newDentist);
  writeSheet("Dentists", dentists);

  return newDentist;
}

export function getAllDentists() {
  return readSheet("Dentists");
}