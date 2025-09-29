// src/app/api/invoices/delete/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Invoice from "@/lib/models/Invoice";

/*  TEMP FIX: Next 15 validator incorrectly infers context.params as Promise.
    Remove this @ts-expect-error once the Next.js type issue is patched. */
export async function DELETE(
  req: NextRequest,
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
