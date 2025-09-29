"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Font,
  Image,
} from "@react-pdf/renderer";

// ---------- PDF Styles ----------
const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10, fontFamily: "Helvetica" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  companyInfo: { flex: 2 },
  invoiceInfo: { flex: 1 },
  bold: { fontWeight: "bold" },
  table: { display: "flex", width: "auto", borderStyle: "solid", borderWidth: 1, borderColor: "#000" },
  tableRow: { flexDirection: "row" },
  tableColHeader: { width: "12.5%", borderStyle: "solid", borderWidth: 1, backgroundColor: "#e5e7eb", padding: 4 },
  tableCol: { width: "12.5%", borderStyle: "solid", borderWidth: 1, padding: 4 },
  tableCell: { fontSize: 9 },
  totalsSection: { marginTop: 10, alignSelf: "flex-end", width: "40%" },
  bankSection: { marginTop: 10, borderWidth: 1, borderColor: "#000", padding: 5 },
});

// ---------- PDF Component ----------
const InvoicePDF = ({ invoice }: { invoice: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.companyInfo}>
          {invoice.companyLogo && <Image src={invoice.companyLogo} style={{ width: 60, height: 60, marginBottom: 4 }} />}
          <Text style={styles.bold}>{invoice.companyName}</Text>
          <Text>GSTIN: {invoice.companyGst}</Text>
          <Text>{invoice.companyAddress}</Text>
          {invoice.companyPhone && <Text>Mobile: {invoice.companyPhone}</Text>}
          {invoice.companyEmail && <Text>Email: {invoice.companyEmail}</Text>}
        </View>

        <View style={styles.invoiceInfo}>
          <Text>Invoice #: {invoice.invoiceNumber}</Text>
          <Text>Invoice Date: {invoice.invoiceDate}</Text>
          {invoice.dueDate && <Text>Due Date: {invoice.dueDate}</Text>}
          {invoice.placeOfSupply && <Text>Place of Supply: {invoice.placeOfSupply}</Text>}
        </View>
      </View>

      {/* Customer */}
      <View style={{ marginBottom: 10 }}>
        <Text style={styles.bold}>Customer Details:</Text>
        <Text>{invoice.customerName}</Text>
        {invoice.billingAddress && <Text>{invoice.billingAddress}</Text>}
        {invoice.customerGST && <Text>GSTIN: {invoice.customerGST}</Text>}
        {invoice.customerPAN && <Text>PAN: {invoice.customerPAN}</Text>}
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          {["#", "Item", "HSN/SAC", "Rate/Item", "Qty", "Taxable Value", "Tax Amount", "Amount"].map((text) => (
            <View key={text} style={styles.tableColHeader}>
              <Text style={styles.tableCell}>{text}</Text>
            </View>
          ))}
        </View>

        {invoice.items.map((it: any, i: number) => {
          const value = it.quantity * it.rate;
          const taxAmount = it.taxAmount || 0;
          const total = value + taxAmount;
          return (
            <View style={styles.tableRow} key={i}>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{i + 1}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{it.description}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{it.hsn}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>₹{it.rate.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>{it.quantity} {it.unit || "PCS"}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>₹{value.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>₹{taxAmount.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text style={styles.tableCell}>₹{total.toFixed(2)}</Text></View>
            </View>
          );
        })}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <Text>Taxable Amount: ₹{invoice.subtotal.toFixed(2)}</Text>
        <Text>CGST {invoice.cgst}%: ₹{invoice.cgstAmount.toFixed(2)}</Text>
        <Text>SGST {invoice.sgst}%: ₹{invoice.sgstAmount.toFixed(2)}</Text>
        <Text style={styles.bold}>Total: ₹{invoice.total.toFixed(2)}</Text>
        <Text>Amount in words: {invoice.amountInWords}</Text>
      </View>

      {/* Bank Details */}
      <View style={styles.bankSection}>
        {invoice.bankName && <Text>Bank: {invoice.bankName}</Text>}
        {invoice.accountNumber && <Text>Account #: {invoice.accountNumber}</Text>}
        {invoice.ifsc && <Text>IFSC: {invoice.ifsc}</Text>}
        {invoice.branch && <Text>Branch: {invoice.branch}</Text>}
      </View>

      {/* Footer */}
      <Text style={{ fontSize: 8, textAlign: "right", marginTop: 20 }}>
        *This is a computer-generated invoice.
      </Text>
    </Page>
  </Document>
);

export default function PreviewInvoicePage() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("previewInvoice");
    if (saved) setInvoice(JSON.parse(saved));
    else router.push("/invoice");
  }, [router]);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;
    const w = window.open("", "", "width=900,height=650");
    if (!w) return;
    w.document.write(`<html><head><title>Invoice</title></head><body>${printRef.current.innerHTML}</body></html>`);
    w.document.close();
    w.focus();
    w.print();
    w.close();
  };

  if (!invoice) return <p className="p-6">Loading…</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Invoice Preview</h1>

          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button variant="outline" onClick={() => router.push("/invoice")}>Back to Edit</Button>
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoice} />}
              fileName={`Invoice-${invoice.invoiceNumber || "Invoice"}.pdf`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
            >
              {({ loading }) => loading ? "Preparing PDF..." : <><Download className="w-4 h-4 mr-2" />Download PDF</>}
            </PDFDownloadLink>
            <Button variant="outline" onClick={handlePrint}><Printer className="w-4 h-4 mr-2" />Print</Button>
          </div>
        </div>

        {/* Preview */}
        <div ref={printRef}>
          <Card className="shadow-xl rounded-2xl overflow-hidden border border-gray-200 bg-white p-8 space-y-6">
  {/* Header */}
  <div className="flex justify-between">
    <div>
      {invoice.companyLogo && (
        <img src={invoice.companyLogo} alt="Logo" className="h-16 mb-2" />
      )}
      <h2 className="text-xl font-bold">{invoice.companyName}</h2>
      <p className="text-sm">{invoice.companyAddress}</p>
      <p className="text-sm">GSTIN: {invoice.companyGst}</p>
      {invoice.companyPhone && <p className="text-sm">Ph: {invoice.companyPhone}</p>}
      {invoice.companyEmail && <p className="text-sm">Email: {invoice.companyEmail}</p>}
    </div>
    <div className="text-right text-sm">
      <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
      <p><strong>Date:</strong> {invoice.invoiceDate}</p>
      {invoice.dueDate && <p><strong>Due:</strong> {invoice.dueDate}</p>}
      {invoice.placeOfSupply && <p><strong>Place of Supply:</strong> {invoice.placeOfSupply}</p>}
    </div>
  </div>

  {/* Customer */}
  <div>
    <h3 className="font-semibold mb-1">Bill To:</h3>
    <p className="text-sm">{invoice.customerName}</p>
    {invoice.billingAddress && <p className="text-sm">{invoice.billingAddress}</p>}
    {invoice.customerGST && <p className="text-sm">GSTIN: {invoice.customerGST}</p>}
    {invoice.customerPAN && <p className="text-sm">PAN: {invoice.customerPAN}</p>}
  </div>

  {/* Items Table */}
  <table className="w-full border border-gray-300 text-sm">
    <thead className="bg-gray-100">
      <tr>
        {["#", "Item", "HSN/SAC", "Rate", "Qty", "Taxable", "Tax", "Total"].map(h => (
          <th key={h} className="border border-gray-300 p-2 text-left">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {invoice.items.map((it: any, i: number) => {
        const value = it.quantity * it.rate;
        const total = value + (it.taxAmount || 0);
        return (
          <tr key={i}>
            <td className="border p-2">{i + 1}</td>
            <td className="border p-2">{it.description}</td>
            <td className="border p-2">{it.hsn}</td>
            <td className="border p-2">₹{it.rate.toFixed(2)}</td>
            <td className="border p-2">{it.quantity}</td>
            <td className="border p-2">₹{value.toFixed(2)}</td>
            <td className="border p-2">₹{(it.taxAmount || 0).toFixed(2)}</td>
            <td className="border p-2">₹{total.toFixed(2)}</td>
          </tr>
        );
      })}
    </tbody>
  </table>

  {/* Totals */}
  <div className="flex justify-end mt-4 text-sm space-y-1 flex-col">
    <p>Taxable: ₹{invoice.subtotal.toFixed(2)}</p>
    <p>CGST {invoice.cgst}%: ₹{invoice.cgstAmount.toFixed(2)}</p>
    <p>SGST {invoice.sgst}%: ₹{invoice.sgstAmount.toFixed(2)}</p>
    <p className="font-bold">Total: ₹{invoice.total.toFixed(2)}</p>
    <p>Amount in words: {invoice.amountInWords}</p>
  </div>

  {/* Bank Details */}
  {(invoice.bankName || invoice.accountNumber) && (
    <div className="border p-3 text-sm">
      {invoice.bankName && <p>Bank: {invoice.bankName}</p>}
      {invoice.accountNumber && <p>Account #: {invoice.accountNumber}</p>}
      {invoice.ifsc && <p>IFSC: {invoice.ifsc}</p>}
      {invoice.branch && <p>Branch: {invoice.branch}</p>}
    </div>
  )}

  <p className="text-right text-xs mt-6">*Computer-generated invoice</p>
</Card>

        </div>
      </div>
    </div>
  );
}
