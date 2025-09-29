// src/app/api/invoices/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/lib/models/Invoice";

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ params is now a Promise
) {
  try {
    await dbConnect();

    // ✅ Await the params object before using it
    const { id } = await context.params;

    const invoice = await Invoice.findByIdAndDelete(id);

    if (!invoice) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Invoice deleted",
    });
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
