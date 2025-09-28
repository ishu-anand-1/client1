// lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/invoicedb';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

type MongooseCache = {
  conn?: typeof mongoose | null;
  promise?: Promise<typeof mongoose> | null;
};

const globalAny: any = global;
if (!globalAny._mongoose) globalAny._mongoose = { conn: null, promise: null } as MongooseCache;
const cache: MongooseCache = globalAny._mongoose;

async function dbConnect() {
  if (cache.conn) return cache.conn;
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cache.conn = await cache.promise;
  return cache.conn;
}

export default dbConnect;
