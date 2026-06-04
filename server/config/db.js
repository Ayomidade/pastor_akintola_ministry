import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined in .env");
}

const client = new MongoClient(mongoUri);

let db;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log(`MongoDB connected: ${db.databaseName}`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

const getCollection = (name) => {
  if (!db) throw new Error("DB not connected. Call connectDB first.");
  return db.collection(name);
};

// Auth
export const admins = () => getCollection("admins");
export const otpTokens = () => getCollection("otpTokens");

// Visitors
export const visitors = () => getCollection("visitors");

// Content
export const posts = () => getCollection("posts");
export const sermons = () => getCollection("sermons");
export const ebooks = () => getCollection("ebooks");

// Engagement
export const comments = () => getCollection("comments");
export const likes = () => getCollection("likes");

// Features
export const livestreams = () => getCollection("livestreams");
export const newsletter = () => getCollection("newsletter");
export const contacts = () => getCollection("contacts");
export const events = () => getCollection("events");
export const media = () => getCollection("media");

// Chat
export const chatSessions = () => getCollection("chatSessions");
export const chatMessages = () => getCollection("chatMessages");
