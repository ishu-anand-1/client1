"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";

// ---------- Types ----------
interface OldItem {
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
}
interface NewItem {
  description: string;
  qty: number;
  rate: number;
  amount: number;
}
interface BaseInvoice {
  _id: string;
  invoiceNumber: string;
  date: string;
  user?: string | null;
}
interface OldInvoice extends BaseInvoice {
  customerName: string;
  customerNumber: string;
  pan: string;
  items: OldItem[];
  cgst: number;
  sgst: number;
  totalAmount: number;
}
interface NewInvoice extends BaseInvoice {
  fromName: string;
  fromAddress: string;
  fromPhone: string;
  fromGstin: string;
  toName: string;
  toAddress: string;
  toPhone: string;
  toGstin: string;
  items: NewItem[];
  subtotal: number;
  cgstPrice: number;
  sgstPrice: number;
  cgstAmount: number;
  sgstAmount: number;
  total: number;
  pdf?: string;
}
type Invoice = OldInvoice | NewInvoice;

// ---------- Component ----------
export default function InvoiceHistoryPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Fetch invoices
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/invoices/history");
        const data = await res.json();
        if (res.ok && data.success) {
          setInvoices(data.invoices);
        } else {
          throw new Error(data?.error || "Failed to fetch invoices");
        }
      } catch (err) {
        console.error("❌ Error fetching invoices:", err);
      }
    })();
  }, []);

  const handleDelete = async (_id: string) => {
    if (!confirm("Are you sure you want to delete this invoice?")) return;
    try {
      const res = await fetch(`/api/invoices/delete/${_id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete invoice");
      setInvoices((prev) => prev.filter((inv) => inv._id !== _id));
      alert("✅ Invoice deleted");
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    }
  };

  const toggleRow = (_id: string) =>
    setExpandedRows((prev) =>
      prev.includes(_id) ? prev.filter((r) => r !== _id) : [...prev, _id]
    );

  // Filter invoices by invoice number or customer/to name
  const filteredInvoices = invoices.filter((inv) => {
    const q = searchQuery.toLowerCase();
    return "customerName" in inv
      ? inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.customerName.toLowerCase().includes(q)
      : inv.invoiceNumber.toLowerCase().includes(q) ||
          inv.toName.toLowerCase().includes(q);
  });

  // ---------- Render Helpers ----------
  const renderItems = (inv: Invoice) =>
    inv.items && inv.items.length > 0 ? (
      <table className="w-full min-w-[500px] text-xs sm:text-sm md:text-base border rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Description</th>
            <th className="p-2 text-left">
              {"hsn" in inv.items[0] ? "HSN" : "Qty"}
            </th>
            <th className="p-2 text-left">
              {"quantity" in inv.items[0] ? "Qty" : "Rate"}
            </th>
            <th className="p-2 text-left">Rate</th>
            <th className="p-2 text-left">Amount</th>
          </tr>
        </thead>
        <tbody>
          {inv.items.map((item: any, idx) => (
            <tr key={idx} className="border-b">
              <td className="p-2">{item.description}</td>
              {"hsn" in item ? (
                <>
                  <td className="p-2">{item.hsn}</td>
                  <td className="p-2">{item.quantity}</td>
                  <td className="p-2">₹{item.rate.toFixed(2)}</td>
                  <td className="p-2">
                    ₹{(item.quantity * item.rate).toFixed(2)}
                  </td>
                </>
              ) : (
                <>
                  <td className="p-2">{item.qty}</td>
                  <td className="p-2">₹{item.rate.toFixed(2)}</td>
                  <td className="p-2">₹{item.amount.toFixed(2)}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div>No items</div>
    );

  const renderTotals = (inv: Invoice) => {
    if ("totalAmount" in inv) {
      const subtotal = inv.items.reduce(
        (acc, i) => acc + i.quantity * i.rate,
        0
      );
      const cgstAmount = (subtotal * inv.cgst) / 100;
      const sgstAmount = (subtotal * inv.sgst) / 100;
      const total = subtotal + cgstAmount + sgstAmount;
      return (
        <div className="mt-4 text-right space-y-1 text-sm sm:text-base">
          <div>Subtotal: ₹{subtotal.toFixed(2)}</div>
          <div>CGST ({inv.cgst}%): ₹{cgstAmount.toFixed(2)}</div>
          <div>SGST ({inv.sgst}%): ₹{sgstAmount.toFixed(2)}</div>
          <div className="font-bold text-lg border-t pt-1">
            Total: ₹{total.toFixed(2)}
          </div>
        </div>
      );
    }
    return (
      <div className="mt-4 text-right space-y-1 text-sm sm:text-base">
        <div>Subtotal: ₹{inv.subtotal.toFixed(2)}</div>
        <div>CGST ({inv.cgstPrice}%): ₹{inv.cgstAmount.toFixed(2)}</div>
        <div>SGST ({inv.sgstPrice}%): ₹{inv.sgstAmount.toFixed(2)}</div>
        <div className="font-bold text-lg border-t pt-1">
          Total: ₹{inv.total.toFixed(2)}
        </div>
      </div>
    );
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mb-6 sm:mb-8 md:mb-10
                     bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent tracking-tight">
        Invoice History
      </h1>

      {/* Search */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search by invoice number or customer"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-white/80 p-3 sm:p-4 pr-10
                       shadow-md focus:border-blue-400 focus:ring-2 focus:ring-blue-300 outline-none
                       transition text-sm sm:text-base"
          />
          <Search
            className="absolute right-4 top-3 sm:top-4 text-gray-400 pointer-events-none"
            size={20}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white/90 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm text-sm sm:text-base">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="p-3 sm:p-4 text-left">Invoice No.</th>
              <th className="p-3 sm:p-4 text-left">Date</th>
              <th className="p-3 sm:p-4 text-left">Customer / To</th>
              <th className="p-3 sm:p-4 text-left">Total</th>
              <th className="p-3 sm:p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => (
                <React.Fragment key={inv._id}>
                  <tr className="hover:bg-blue-50 transition">
                    <td className="p-3 sm:p-4 flex items-center justify-between font-medium text-gray-800">
                      {inv.invoiceNumber}
                      <button
                        onClick={() => toggleRow(inv._id)}
                        className="ml-2 text-gray-500 hover:text-blue-600 transition"
                      >
                        {expandedRows.includes(inv._id) ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </td>
                    <td className="p-3 sm:p-4 text-gray-700">
                      {new Date(inv.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 sm:p-4 text-gray-700">
                      {"customerName" in inv ? inv.customerName : inv.toName}
                    </td>
                    <td className="p-3 sm:p-4 font-semibold text-gray-800">
                      ₹
                      {"totalAmount" in inv
                        ? inv.totalAmount.toFixed(2)
                        : inv.total.toFixed(2)}
                    </td>
                    <td className="p-3 sm:p-4">
                      <button
                        onClick={() => handleDelete(inv._id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>

                  {expandedRows.includes(inv._id) && (
                    <tr>
                      <td colSpan={5} className="p-3 sm:p-4 bg-gray-50">
                        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
                          <div className="flex flex-col md:flex-row justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">
                                {"customerName" in inv
                                  ? inv.customerName
                                  : inv.toName}
                              </h3>
                              {"customerNumber" in inv && (
                                <p className="text-sm text-gray-500">
                                  Contact: {inv.customerNumber}
                                </p>
                              )}
                              {"pan" in inv && (
                                <p className="text-sm text-gray-500">
                                  PAN: {inv.pan}
                                </p>
                              )}
                            </div>
                            <div className="text-right text-sm text-gray-600">
                              <p className="font-medium">
                                Invoice: {inv.invoiceNumber}
                              </p>
                              <p>
                                 Date: {new Date(inv.date).toISOString().slice(0, 10)}
    
                             </p>
                            </div>
                          </div>

                          <div className="overflow-x-auto rounded-lg border border-gray-200 mb-4">
                            {renderItems(inv)}
                          </div>

                          <div className="pt-4 border-t border-gray-200">
                            {renderTotals(inv)}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
