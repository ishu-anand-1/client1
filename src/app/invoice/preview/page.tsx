"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from "@react-pdf/renderer";

// ---------------- PDF Styles ----------------
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

const InvoicePDF = ({ invoice }: { invoice: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.companyInfo}>
          {invoice.companyLogo && (
            <Image src={invoice.companyLogo} style={{ width: 80, height: 40, marginBottom: 4 }} />
          )}
          <Text style={styles.bold}>{invoice.companyName}</Text>
          <Text>{invoice.companyAddress}</Text>
          <Text>GSTIN: {invoice.companyGst}</Text>
          {invoice.companyPhone && <Text>Ph: {invoice.companyPhone}</Text>}
          {invoice.companyEmail && <Text>Email: {invoice.companyEmail}</Text>}
        </View>
        <View style={styles.invoiceInfo}>
          <Text style={styles.bold}>Invoice #: {invoice.invoiceNumber}</Text>
          <Text>Date: {invoice.invoiceDate}</Text>
          {invoice.dueDate && <Text>Due: {invoice.dueDate}</Text>}
          {invoice.placeOfSupply && <Text>Place of Supply: {invoice.placeOfSupply}</Text>}
        </View>
      </View>

      {/* Customer */}
      <View style={{ marginBottom: 8 }}>
        <Text style={styles.bold}>Bill To:</Text>
        <Text>{invoice.customerName}</Text>
        {invoice.billingAddress && <Text>{invoice.billingAddress}</Text>}
        {invoice.customerGST && <Text>GSTIN: {invoice.customerGST}</Text>}
        {invoice.customerPAN && <Text>PAN: {invoice.customerPAN}</Text>}
      </View>

      {/* Items Table */}
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.bold]}>
          {["#", "Item", "HSN/SAC", "Rate", "Qty", "Taxable", "Tax", "Total"].map((h) => (
            <View key={h} style={styles.tableColHeader}>
              <Text style={styles.tableCell}>{h}</Text>
            </View>
          ))}
        </View>
        {invoice.items.map((it: any, i: number) => {
          const value = it.quantity * it.rate;
          const total = value + (it.taxAmount || 0);
          return (
            <View key={i} style={styles.tableRow}>
              <View style={styles.tableCol}><Text>{i + 1}</Text></View>
              <View style={styles.tableCol}><Text>{it.description}</Text></View>
              <View style={styles.tableCol}><Text>{it.hsn}</Text></View>
              <View style={styles.tableCol}><Text>₹{it.rate.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text>{it.quantity}</Text></View>
              <View style={styles.tableCol}><Text>₹{value.toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text>₹{(it.taxAmount || 0).toFixed(2)}</Text></View>
              <View style={styles.tableCol}><Text>₹{total.toFixed(2)}</Text></View>
            </View>
          );
        })}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <Text>Taxable: ₹{invoice.subtotal.toFixed(2)}</Text>
        <Text>CGST {invoice.cgst}%: ₹{invoice.cgstAmount.toFixed(2)}</Text>
        <Text>SGST {invoice.sgst}%: ₹{invoice.sgstAmount.toFixed(2)}</Text>
        <Text style={styles.bold}>Total: ₹{invoice.total.toFixed(2)}</Text>
        <Text>Amount in words: {invoice.amountInWords}</Text>
      </View>

      {/* Bank Details */}
      {(invoice.bankName || invoice.accountNumber) && (
        <View style={styles.bankSection}>
          {invoice.bankName && <Text>Bank: {invoice.bankName}</Text>}
          {invoice.accountNumber && <Text>Account #: {invoice.accountNumber}</Text>}
          {invoice.ifsc && <Text>IFSC: {invoice.ifsc}</Text>}
          {invoice.branch && <Text>Branch: {invoice.branch}</Text>}
        </View>
      )}

      <Text style={{ marginTop: 12, fontSize: 8, textAlign: "right" }}>
        *Computer-generated invoice
      </Text>
    </Page>
  </Document>
);


export default function PreviewInvoicePage() {
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("previewInvoice");
    if (saved) setInvoice(JSON.parse(saved));
    else router.push("/invoice");
  }, [router]);

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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900">
            Invoice Preview
          </h1>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => router.push("/invoice")}>Back to Edit</Button>
            <PDFDownloadLink
              document={<InvoicePDF invoice={invoice} />}
              fileName={`Invoice-${invoice.invoiceNumber || "Invoice"}.pdf`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded flex items-center text-sm"
            >
              {({ loading }) =>
                loading ? "Preparing PDF..." : (
                  <>
                    <Download className="w-4 h-4 mr-1" />Download PDF
                  </>
                )
              }
            </PDFDownloadLink>
            <Button variant="outline" onClick={handlePrint} className="flex items-center text-sm">
              <Printer className="w-4 h-4 mr-1" />Print
            </Button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div ref={printRef}>
          <Card className="shadow-xl rounded-2xl overflow-hidden border border-gray-200 bg-white p-4 sm:p-6 md:p-8 space-y-6">
            {/* Company / Customer header */}
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
              <div>
                {invoice.companyLogo && (
                  <img src={invoice.companyLogo} alt="Logo" className="h-14 sm:h-16 mb-2" />
                )}
                <h2 className="text-lg sm:text-xl font-bold">{invoice.companyName}</h2>
                <p className="text-sm">{invoice.companyAddress}</p>
                <p className="text-sm">GSTIN: {invoice.companyGst}</p>
                {invoice.companyPhone && <p className="text-sm">Ph: {invoice.companyPhone}</p>}
                {invoice.companyEmail && <p className="text-sm">Email: {invoice.companyEmail}</p>}
              </div>
              <div className="text-sm text-left md:text-right">
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

            {/* Items Table: horizontal scroll on mobile */}
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    {["#", "Item", "HSN/SAC", "Rate", "Qty", "Taxable", "Tax", "Total"].map(h => (
                      <th key={h} className="border border-gray-300 p-2 text-left whitespace-nowrap">{h}</th>
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
            </div>

            {/* Totals */}
            <div className="flex flex-col items-end mt-4 text-sm space-y-1">
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
