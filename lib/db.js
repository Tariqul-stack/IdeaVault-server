import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable in .env");
}

const client = new MongoClient(uri);
let db;

export async function connectDB() {
  if (db) {
    return db;
  }

  await client.connect();
  db = client.db();

  return db;
}
