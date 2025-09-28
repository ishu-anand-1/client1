// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

const MONGODB_URI = process.env.MONGODB_URI!;
const client = new MongoClient(MONGODB_URI);
let db: any;

async function connectDB() {
  if (!db) {
    await client.connect();
    db = client.db();
  }
  return db;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const db = await connectDB();
    const users = db.collection("users");

    const user = await users.findOne({ email });
    if (!user) return NextResponse.json({ error: "No user found" }, { status: 401 });

    const isValid = await compare(password, user.password);
    if (!isValid) return NextResponse.json({ error: "Invalid password" }, { status: 401 });

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, process.env.NEXTAUTH_SECRET!, { expiresIn: "7d" });

    return NextResponse.json({ token, user: { id: user._id.toString(), email: user.email, name: user.name } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
