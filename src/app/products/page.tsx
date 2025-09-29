// app/products/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface Product {
  description: string;
  rate: number;
  stock: number;
}

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [desc, setDesc] = useState("");
  const [rate, setRate] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");

  // Load saved products from localStorage (or API later)
  useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  const handleAdd = () => {
    if (!desc || rate === "" || rate <= 0 || stock === "" || stock < 0) return;
    const newProducts = [...products, { description: desc, rate: Number(rate), stock: Number(stock) }];
    setProducts(newProducts);
    localStorage.setItem("products", JSON.stringify(newProducts));
    setDesc("");
    setRate("");
    setStock("");
  };

  const handleDelete = (index: number) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
    localStorage.setItem("products", JSON.stringify(newProducts));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Product Listing</h1>

      {/* Add Product Form */}
      <Card className="mb-6 shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Description">
            <Input
              placeholder="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </Field>

          <Field label="Rate (₹)">
            <Input
              type="number"
              placeholder="Rate"
              value={rate}
              onChange={(e) => setRate(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </Field>

          <Field label="Stock">
            <Input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </Field>

          <Button
            onClick={handleAdd}
            className="col-span-1 md:col-span-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Add Product
          </Button>
        </CardContent>
      </Card>

      {/* Saved Products */}
      <h2 className="text-2xl font-semibold mb-4">Saved Products</h2>
      {products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map((p, i) => (
            <div
              key={i}
              className="flex justify-between items-center border p-2 rounded-md bg-white shadow-sm"
            >
              <div>
                <strong>{p.description}</strong> - ₹{p.rate} (Stock: {p.stock})
              </div>
              <Button variant="destructive" onClick={() => handleDelete(i)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Field helper component */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col space-y-1">
      <label className="font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}
