import mongoose, { Schema, model, models } from "mongoose";

const ItemSchema = new Schema({
  description: String,
  hsn: String,
  quantity: Number,
  rate: Number,
});

const InvoiceSchema = new Schema({
  invoiceNumber: { type: String, required: true },
  customerName: { type: String, required: true },
  customerNumber: String,
  date: { type: Date, default: Date.now },
  pan: String,
  items: [ItemSchema],
  cgst: Number,
  sgst: Number,
  totalAmount: Number,
  user: { type: Schema.Types.ObjectId, ref: "User", required: false }, // optional
});

// Avoid recompiling model
const Invoice = models.Invoice || model("Invoice", InvoiceSchema);
export default Invoice;
