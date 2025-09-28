import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/lib/models/Invoice";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const invoices = await Invoice.find({ user: session.user.id }).sort({ date: -1 });

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.error("Fetch Invoices Error:", error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}
