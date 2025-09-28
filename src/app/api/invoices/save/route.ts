import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/lib/models/Invoice";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    await dbConnect();

    const newInvoice = await Invoice.create({
      invoiceNumber: data.invoiceNumber,
      customerName: data.customerName,
      customerNumber: data.customerNumber,
      date: new Date(data.date),
      pan: data.pan,
      items: data.items,
      cgst: data.cgst,
      sgst: data.sgst,
      totalAmount: data.totalAmount,
      user: data.user || null, // guest invoices allowed
    });

    return NextResponse.json({ success: true, invoice: newInvoice });
  } catch (error) {
    console.error("Save Invoice Error:", error);
    return NextResponse.json(
      { error: (error as any).message || "Failed to save invoice" },
      { status: 500 }
    );
  }
}
