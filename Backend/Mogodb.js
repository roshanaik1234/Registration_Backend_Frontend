import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

let db;

export async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db("UserRegistration");
    console.log("MongoDB connected");
  }
  return db;
}

export function getDB() {
  if (!db) {
    throw new Error("Database not connected yet");
  }
  return db;
}

