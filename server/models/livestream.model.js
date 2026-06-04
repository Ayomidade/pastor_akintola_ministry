import { livestreams } from "../config/db.js";

export async function getActiveLivestream() {
  return await livestreams().findOne({ isActive: true });
}
