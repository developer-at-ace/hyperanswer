import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.warn("MONGODB_URI is not configured. Database access is disabled for this demo foundation.");
}

type MongoCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongoCache | undefined;
}

const cached: MongoCache = global.mongooseCache ?? { conn: null, promise: null };
global.mongooseCache = cached;

export async function connectToDatabase() {
  if (!uri) return null;
  if (cached.conn) return cached.conn;
  if (!cached.promise) cached.promise = mongoose.connect(uri);
  cached.conn = await cached.promise;
  return cached.conn;
}
