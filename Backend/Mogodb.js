// // db.js
// import { MongoClient } from "mongodb";

// const uri = "mongodb://localhost:27017/";
// const client = new MongoClient(uri);

// let db;
// let usersCollection;

// export async function connectDB() {
//   await client.connect();
//   db = client.db("UserRegistration"); // use your database name here
// //   usersCollection = db.collection("UserDetail"); // use your collection name here
// //   console.log("usersCollection",usersCollection);

//   console.log("MongoDB connected");
// }

// export function getDB() {
//   if (!db) {
//     throw new Error("Database not connected yet");
//   }
//   return db;
// }

// db.js
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

