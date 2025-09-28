"use client";

import { useSearchParams } from "next/navigation";

export default function InvoicePreview() {
  const searchParams = useSearchParams();

  const invoiceNumber = searchParams.get("invoiceNumber") || "";
  const invoiceDate = searchParams.get("invoiceDate") || "";
  const customerName = searchParams.get("customerName") || "";
  const customerNumber = searchParams.get("customerNumber") || "";
  const pan = searchParams.get("pan") || "";
  const cgst = Number(searchParams.get("cgst") || 0);
  const sgst = Number(searchParams.get("sgst") || 0);
  const items = JSON.parse(searchParams.get("items") || "[]");

  // Calculations
  const subtotal = items.reduce((acc: number, item: any) => acc + item.quantity * item.rate, 0);
  const cgstAmount = (subtotal * cgst) / 100;
  const sgstAmount = (subtotal * sgst) / 100;
  const total = subtotal + cgstAmount + sgstAmount;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="bg-white w-full max-w-5xl border shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-4">
          <div>
            <h1 className="text-xl font-bold text-blue-600">DEV ELECTRICALS</h1>
            <p>GSTIN: 10AGUPK3266C1ZM</p>
            <p>101, Tekari road, Purani godam</p>
            <p>Gaya ji, BIHAR, 823001</p>
            <p>Mobile: +91 8507292194</p>
            <p>Email: amishkumardeo@gmail.com</p>
          </div>
          <div className="text-right">
            <p><strong>Invoice #: </strong>{invoiceNumber}</p>
            <p><strong>Date: </strong>{invoiceDate}</p>
            <p><strong>Place of Supply: </strong>10-BIHAR</p>
            <p><strong>Due Date: </strong>08 Sep 2025</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="border-b py-3">
          <h2 className="font-semibold">Customer Details</h2>
          <p><strong>Name:</strong> {customerName}</p>
          <p><strong>Contact:</strong> {customerNumber}</p>
          <p><strong>PAN:</strong> {pan}</p>
        </div>

        {/* Items Table */}
        <table className="w-full border-collapse border mt-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Item</th>
              <th className="border p-2">HSN/SAC</th>
              <th className="border p-2">Rate / Item</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Taxable Value</th>
              <th className="border p-2">Tax Amount</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, idx: number) => {
              const taxable = item.quantity * item.rate;
              const tax = taxable * (cgst + sgst) / 100;
              const amount = taxable + tax;
              return (
                <tr key={idx}>
                  <td className="border p-1 text-center">{idx + 1}</td>
                  <td className="border p-1">{item.description}</td>
                  <td className="border p-1">{item.hsn}</td>
                  <td className="border p-1 text-right">₹{item.rate.toFixed(2)}</td>
                  <td className="border p-1 text-center">{item.quantity}</td>
                  <td className="border p-1 text-right">₹{taxable.toFixed(2)}</td>
                  <td className="border p-1 text-right">₹{tax.toFixed(2)}</td>
                  <td className="border p-1 text-right">₹{amount.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mt-4">
          <div className="w-1/3 space-y-1">
            <div className="flex justify-between">
              <span>Taxable Amount</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST ({cgst}%)</span>
              <span>₹{cgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST ({sgst}%)</span>
              <span>₹{sgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="mt-6 border-t pt-2">
          <h3 className="font-semibold">Bank Details:</h3>
          <p>Bank: Punjab National Bank</p>
          <p>Account #: 1967002100034775</p>
          <p>IFSC Code: PUNB0196700</p>
          <p>Branch: GAYA TEKARI ROAD, DISTT. GAYA</p>
        </div>

        {/* Signature */}
        <div className="mt-6 flex justify-end">
          <div className="text-right">
            <p className="font-semibold">For DEV ELECTRICALS</p>
            <p className="italic">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
