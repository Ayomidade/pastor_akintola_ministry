import { admins, otpTokens } from "../config/db.js";
import { ObjectId } from "mongodb";

export async function findAdminByEmail(email) {
  return await admins().findOne({ email });
}

export async function findAdminById(id) {
  return await admins().findOne({ _id: new ObjectId(id) });
}

export async function adminExists() {
  const count = await admins().find().toArray();
  
  return count.length > 0;
}

export async function createAdmin({ name, email, passwordHash }) {
  return await admins().insertOne({
    name,
    email,
    passwordHash,
    createdAt: new Date(),
  });
}

export async function updateAdminPassword({ email, passwordHash }) {
  return await admins().updateOne(
    { email },
    { $set: { passwordHash, updatedAt: new Date() } },
  );
}
