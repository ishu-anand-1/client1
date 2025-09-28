"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Item {
  description: string;
  hsn: string;
  quantity: number;
  rate: number;
}

export default function InvoicePage() {
  const router = useRouter();

  // ---------- State ----------
  const [companyName, setCompanyName] = useState("DEV ELECTRICALS");
  const [companyGst, setCompanyGst] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [companyPhone, setCompanyPhone] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceDate, setInvoiceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [placeOfSupply, setPlaceOfSupply] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerGST, setCustomerGST] = useState("");
  const [customerPAN, setCustomerPAN] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const [items, setItems] = useState<Item[]>([
    { description: "", hsn: "", quantity: 1, rate: 0 },
  ]);

  const [cgst, setCgst] = useState(9);
  const [sgst, setSgst] = useState(9);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [branch, setBranch] = useState("");

  // ---------- Calculations ----------
  const subtotal = items.reduce(
    (acc, item) => acc + item.quantity * item.rate,
    0
  );
  const cgstAmount = (subtotal * cgst) / 100;
  const sgstAmount = (subtotal * sgst) / 100;
  const total = subtotal + cgstAmount + sgstAmount;

  // ---------- Handlers ----------
  const handleAddItem = () =>
    setItems([...items, { description: "", hsn: "", quantity: 1, rate: 0 }]);
  const handleDeleteItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));
  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index][field] =
      field === "quantity" || field === "rate" ? Number(value) : String(value);
    setItems(newItems);
  };

  const handleSave = async () => {
    if (!invoiceNumber || !customerName)
      return alert("Invoice Number & Customer Name required");

    try {
      const res = await fetch("/api/invoices/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceNumber,
          date: invoiceDate,
          customerName,
          customerNumber: companyPhone,
          pan: customerPAN,
          items,
          cgst,
          sgst,
          totalAmount: total,
          user: null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to save");
      alert("✅ Invoice saved successfully!");
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  const handlePreview = () => {
    const invoiceData = {
      companyName,
      companyGst,
      companyAddress,
      companyEmail,
      companyPhone,
      invoiceNumber,
      invoiceDate,
      placeOfSupply,
      customerName,
      customerGST,
      customerPAN,
      billingAddress,
      items,
      cgst,
      sgst,
      subtotal,
      cgstAmount,
      sgstAmount,
      total,
      bankName,
      accountNumber,
      ifsc,
      branch,
    };
    localStorage.setItem("previewInvoice", JSON.stringify(invoiceData));
    router.push("/invoice/preview");
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-10">
        <h1 className="text-5xl font-extrabold text-center text-indigo-700 drop-shadow-sm">
          Create Invoice
        </h1>

        {/* 1️⃣ Invoice Section */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-indigo-700">
              Invoice Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Invoice Number">
              <Input
                placeholder="Invoice Number"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
              />
            </Field>
            <Field label="Date">
              <Input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
              />
            </Field>
            <Field label="Place of Supply">
              <Input
                placeholder="Place of Supply"
                value={placeOfSupply}
                onChange={(e) => setPlaceOfSupply(e.target.value)}
              />
            </Field>
          </CardContent>
        </Card>

        {/* 2️⃣ Customer & Company Info */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-indigo-700">
              Customer & Company Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Field label="Company Name">
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                />
              </Field>
              <Field label="Company GSTIN">
                <Input
                  value={companyGst}
                  onChange={(e) => setCompanyGst(e.target.value)}
                />
              </Field>
              <Field label="Company Email">
                <Input
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                />
              </Field>
              <Field label="Company Address">
                <Input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                />
              </Field>
              <Field label="Company Phone">
                <Input
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                />
              </Field>
            </div>
            <div className="space-y-4">
              <Field label="Customer Name">
                <Input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </Field>
              <Field label="Customer GSTIN">
                <Input
                  value={customerGST}
                  onChange={(e) => setCustomerGST(e.target.value)}
                />
              </Field>
              <Field label="Customer PAN">
                <Input
                  value={customerPAN}
                  onChange={(e) => setCustomerPAN(e.target.value)}
                />
              </Field>
              <Field label="Billing Address">
                <Input
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* 3️⃣ Items Section */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader className="flex justify-between items-center">
            <CardTitle className="text-2xl font-semibold text-indigo-700">
              Items
            </CardTitle>
            <Button
              size="sm"
              onClick={handleAddItem}
              className="bg-indigo-600 hover:bg-indigo-700 shadow-sm"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-6 gap-3 items-end border-b pb-4"
              >
                <Field label="Description">
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      handleItemChange(i, "description", e.target.value)
                    }
                  />
                </Field>
                <Field label="HSN">
                  <Input
                    value={item.hsn}
                    onChange={(e) =>
                      handleItemChange(i, "hsn", e.target.value)
                    }
                  />
                </Field>
                <Field label="Quantity">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(i, "quantity", e.target.value)
                    }
                  />
                </Field>
                <Field label="Rate (₹)">
                  <Input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleItemChange(i, "rate", e.target.value)
                    }
                  />
                </Field>
                <Field label="Total">
                  <span className="font-medium">
                    ₹{item.quantity * item.rate}
                  </span>
                </Field>
                <div className="flex justify-center">
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => handleDeleteItem(i)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 4️⃣ Taxes + Bank + Totals */}
        <Card className="shadow-md rounded-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-indigo-700">
              Taxes, Bank & Total
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <Field label="CGST (%)">
                <Input
                  type="number"
                  value={cgst}
                  onChange={(e) => setCgst(Number(e.target.value))}
                />
              </Field>
              <Field label="SGST (%)">
                <Input
                  type="number"
                  value={sgst}
                  onChange={(e) => setSgst(Number(e.target.value))}
                />
              </Field>
              <Field label="Bank Name">
                <Input
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
              </Field>
              <Field label="Account Number">
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
              </Field>
              <Field label="IFSC Code">
                <Input value={ifsc} onChange={(e) => setIfsc(e.target.value)} />
              </Field>
              <Field label="Branch">
                <Input value={branch} onChange={(e) => setBranch(e.target.value)} />
              </Field>
            </div>
            <div className="space-y-3 text-lg">
              <p>Subtotal: <span className="font-semibold">₹{subtotal.toFixed(2)}</span></p>
              <p>CGST ({cgst}%): <span className="font-semibold">₹{cgstAmount.toFixed(2)}</span></p>
              <p>SGST ({sgst}%): <span className="font-semibold">₹{sgstAmount.toFixed(2)}</span></p>
              <p className="text-2xl font-bold text-indigo-700">
                Total: ₹{total.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 5️⃣ Actions */}
        <div className="flex justify-between gap-4">
          <Button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 shadow-md px-6 py-2 text-lg"
          >
            Save Invoice
          </Button>
          <Button
            onClick={handlePreview}
            className="bg-indigo-600 hover:bg-indigo-700 shadow-md px-6 py-2 text-lg"
          >
            Preview Invoice
          </Button>
        </div>
      </div>
    </div>
  );
}

/** Small helper for label + content */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
