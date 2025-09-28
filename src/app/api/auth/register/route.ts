// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/user"; // your Mongoose User model
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    await dbConnect(); // connect to MongoDB via Mongoose

    const { name, email, password } = await req.json();

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // hash password
    const hashedPassword = await hash(password, 10);

    // create new user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({ success: true, user: { id: newUser._id, email: newUser.email, name: newUser.name } });
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
