// app/api/invoices/history/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/lib/models/Invoice";

export async function GET() {
  try {
    await dbConnect();

    // 🔹 If you want invoices for ALL users (no login required)
    const invoices = await Invoice.find().sort({ date: -1 });

    return NextResponse.json({ success: true, invoices });
  } catch (error) {
    console.error("Fetch Invoices Error:", error);
    return NextResponse.json(
      { error: (error as any).message || "Failed to fetch invoices" },
      { status: 500 }
    );
  }
}
