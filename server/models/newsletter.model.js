import { newsletter } from "../config/db.js";

export async function findSubscriberByEmail(email) {
  return await newsletter().findOne({ email });
}
