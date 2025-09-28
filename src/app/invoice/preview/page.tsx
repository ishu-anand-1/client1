"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";

export default function PreviewInvoicePage() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);

  // Ref for the printable / downloadable section
  const printRef = useRef<HTMLDivElement>(null);

  // Load invoice from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("previewInvoice");
    if (saved) setInvoice(JSON.parse(saved));
    else router.push("/invoice");
  }, [router]);

  // ---------- Download PDF ----------
  const handleDownload = async () => {
    if (!printRef.current) return;
    const html2pdf = (await import("html2pdf.js")).default; // dynamic import

    const opt = {
      margin: 0.5,
      filename: `Invoice-${invoice?.invoiceNumber || "Invoice"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
    };
    html2pdf().from(printRef.current).set(opt).save();
  };

  // ---------- Print ----------
  const handlePrint = () => {
    if (!printRef.current) return;
    const printWindow = window.open("", "", "width=900,height=650");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: sans-serif; padding: 20px; }
          </style>
        </head>
        <body>${printRef.current.innerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!invoice) return <p className="p-6">Loading…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Invoice Preview
          </h1>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-200"
              onClick={() => router.push("/invoice")}
            >
              Back to Edit
            </Button>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleDownload}
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>

            <Button
              variant="outline"
              className="border-gray-300 hover:bg-gray-200"
              onClick={handlePrint}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
          </div>
        </div>

        {/* Everything inside printRef will be included in the PDF/Print */}
        <div ref={printRef}>
          <Card className="shadow-xl rounded-2xl overflow-hidden border border-gray-200 bg-white">
            <CardContent className="p-10">
              <h2 className="text-center text-2xl font-bold text-blue-700 tracking-widest mb-8">
                TAX INVOICE
              </h2>

              {/* Company + Invoice Details */}
              <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {invoice.companyName}
                  </h3>
                  <p className="text-sm">GSTIN: {invoice.companyGst}</p>
                  <p className="text-sm">{invoice.companyAddress}</p>
                  {invoice.companyPhone && (
                    <p className="text-sm">Mobile: {invoice.companyPhone}</p>
                  )}
                  {invoice.companyEmail && (
                    <p className="text-sm">Email: {invoice.companyEmail}</p>
                  )}
                </div>
                <div className="text-sm space-y-1 text-right">
                  <p>
                    Invoice #:{" "}
                    <span className="font-medium">{invoice.invoiceNumber}</span>
                  </p>
                  <p>Invoice Date: {invoice.invoiceDate}</p>
                  {invoice.dueDate && <p>Due Date: {invoice.dueDate}</p>}
                  {invoice.placeOfSupply && (
                    <p>Place of Supply: {invoice.placeOfSupply}</p>
                  )}
                </div>
              </div>

              {/* Customer Details */}
              <div className="mb-8 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-gray-800">
                  Customer Details
                </h4>
                <p className="text-sm">{invoice.customerName}</p>
                {invoice.billingAddress && (
                  <p className="text-sm">{invoice.billingAddress}</p>
                )}
                {invoice.customerGST && (
                  <p className="text-sm">GSTIN: {invoice.customerGST}</p>
                )}
                {invoice.customerPAN && (
                  <p className="text-sm">PAN: {invoice.customerPAN}</p>
                )}
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full border border-gray-200 text-sm rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-blue-50 text-gray-700">
                      <th className="border p-2 text-left">#</th>
                      <th className="border p-2 text-left">Item</th>
                      <th className="border p-2 text-center">HSN/SAC</th>
                      <th className="border p-2 text-center">Rate</th>
                      <th className="border p-2 text-center">Qty</th>
                      <th className="border p-2 text-center">Taxable Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((it: any, i: number) => {
                      const value = it.quantity * it.rate;
                      return (
                        <tr
                          key={i}
                          className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                        >
                          <td className="border p-2">{i + 1}</td>
                          <td className="border p-2">{it.description}</td>
                          <td className="border p-2 text-center">{it.hsn}</td>
                          <td className="border p-2 text-center">
                            ₹{it.rate.toFixed(2)}
                          </td>
                          <td className="border p-2 text-center">
                            {it.quantity}
                          </td>
                          <td className="border p-2 text-center">
                            ₹{value.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-10">
                <div className="w-80 space-y-2 text-sm bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex justify-between">
                    <span>Taxable Amount</span>
                    <span className="font-medium">
                      ₹{invoice.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST {invoice.cgst}%</span>
                    <span className="font-medium">
                      ₹{invoice.cgstAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST {invoice.sgst}%</span>
                    <span className="font-medium">
                      ₹{invoice.sgstAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span>₹{invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              {(invoice.bankName || invoice.accountNumber) && (
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-6 text-sm">
                  <h4 className="font-semibold mb-1">Bank Details</h4>
                  {invoice.bankName && <p>Bank: {invoice.bankName}</p>}
                  {invoice.accountNumber && (
                    <p>Account #: {invoice.accountNumber}</p>
                  )}
                  {invoice.ifsc && <p>IFSC: {invoice.ifsc}</p>}
                  {invoice.branch && <p>Branch: {invoice.branch}</p>}
                </div>
              )}

              <p className="text-right text-xs italic text-gray-500">
                *This is a computer-generated invoice.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
