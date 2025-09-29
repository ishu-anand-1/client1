"use client";

import React, { useState, useEffect } from "react";
import { Trash2, Search, ChevronDown, ChevronUp } from "lucide-react";

// Define the Invoice type according to your data structure
type Invoice = {
  _id: string;
  invoiceNumber: string;
  date: string;
  customerName?: string;
  toName?: string;
  totalAmount?: number;
  total?: number;
  // Add other fields as needed
};

export default function InvoiceHistoryPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/invoices/history");
      const data = await res.json();
      if (res.ok && data.success) setInvoices(data.invoices);
    })();
  }, []);

  const handleDelete = async (_id: string) => {
    if (!confirm("Delete this invoice?")) return;
    const res = await fetch(`/api/invoices/delete/${_id}`, { method: "DELETE" });
    if (res.ok) setInvoices((p) => p.filter((inv) => inv._id !== _id));
  };

  const toggleRow = (id: string) =>
    setExpandedRows((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const filtered = invoices.filter((inv) =>
    (
      inv.invoiceNumber +
      ("customerName" in inv ? inv.customerName : inv.toName)
    )
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // ----- same renderItems & renderTotals as before -----

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4 sm:p-8">
      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center mb-6 sm:mb-10 
                     bg-gradient-to-r from-purple-600 to-blue-500 
                     bg-clip-text text-transparent">
        Invoice History
      </h1>

      {/* Search */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Search invoices"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-full border border-gray-300 bg-white/80 
                       p-3 sm:p-4 pr-10 shadow-md focus:ring-2 focus:ring-blue-300 
                       text-sm sm:text-base"
          />
          <Search className="absolute right-4 top-3.5 sm:top-4 text-gray-400" size={18} />
        </div>
      </div>

      {/* ---- Desktop / tablet table ---- */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-white/90 rounded-2xl shadow-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left text-sm sm:p-4">Invoice No.</th>
              <th className="p-3 text-left text-sm sm:p-4">Date</th>
              <th className="p-3 text-left text-sm sm:p-4">Customer / To</th>
              <th className="p-3 text-left text-sm sm:p-4">Total</th>
              <th className="p-3 text-left text-sm sm:p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  No invoices found
                </td>
              </tr>
            ) : (
              filtered.map((inv) => (
                <React.Fragment key={inv._id}>
                  <tr className="hover:bg-blue-50 transition text-sm">
                    <td className="p-3 font-medium flex justify-between">
                      {inv.invoiceNumber}
                      <button
                        onClick={() => toggleRow(inv._id)}
                        className="ml-2 text-gray-500 hover:text-blue-600"
                      >
                        {expandedRows.includes(inv._id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                    <td className="p-3">{new Date(inv.date).toLocaleDateString()}</td>
                    <td className="p-3">
                      {"customerName" in inv ? inv.customerName : inv.toName}
                    </td>
                    <td className="p-3 font-semibold">
                      ₹{"totalAmount" in inv
                        ? (inv.totalAmount ?? 0).toFixed(2)
                        : (inv.total ?? 0).toFixed(2)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDelete(inv._id)}
                        className="flex items-center gap-1 text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    </td>
                  </tr>

                  {expandedRows.includes(inv._id) && (
                    <tr>
                      <td colSpan={5} className="p-3 bg-gray-50">
                        {/* details component unchanged */}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---- Mobile cards ---- */}
      <div className="sm:hidden space-y-4">
        {filtered.length === 0 && (
          <p className="text-center text-gray-500">No invoices found</p>
        )}
        {filtered.map((inv) => (
          <div
            key={inv._id}
            className="bg-white rounded-xl shadow-md p-4 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="font-semibold text-gray-800">{inv.invoiceNumber}</p>
                <p className="text-xs text-gray-500">
                  {new Date(inv.date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(inv._id)}
                className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-1">
              {"customerName" in inv ? inv.customerName : inv.toName}
            </p>
            <p className="font-bold text-gray-900">
              ₹{"totalAmount" in inv ? (inv.totalAmount ?? 0).toFixed(2) : (inv.total ?? 0).toFixed(2)}
            </p>

            <button
              onClick={() => toggleRow(inv._id)}
              className="mt-2 text-blue-600 text-sm flex items-center"
            >
              {expandedRows.includes(inv._id) ? (
                <>
                  Hide Details <ChevronUp size={14} className="ml-1" />
                </>
              ) : (
                <>
                  View Details <ChevronDown size={14} className="ml-1" />
                </>
              )}
            </button>

            {expandedRows.includes(inv._id) && (
              <div className="mt-3 border-t pt-3 text-xs">
                {/* reuse renderItems + renderTotals here */}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
