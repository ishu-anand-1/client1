import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/lib/models/Invoice";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const invoice = await Invoice.findByIdAndDelete(params.id);

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Invoice deleted" });
  } catch (error) {
    console.error("Delete Invoice Error:", error);
    return NextResponse.json({ error: "Failed to delete invoice" }, { status: 500 });
  }
}
