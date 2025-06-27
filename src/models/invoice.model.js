import mongoose from "mongoose";
import { Counter } from "./counter.model.js";

const serviceSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
    totalTimeInMinutes: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { _id: false }
);
const invoiceSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: String,
      required: true,
    },
    invoiceDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    servicesProvided: [serviceSchema],
    subTotal: {
      type: Number,
      required: true,
    },
    subsidyPercentage: {
      type: Number,
    },
    subsidyAmount: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    notes: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

invoiceSchema.statics.generateInvoiceId = async function () {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const counterKey = `vks-${year}-${month}`;

  const updatedCounter = await Counter.findByIdAndUpdate(
    counterKey,
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const paddedSeq = String(updatedCounter.seq).padStart(4, "0");
  return `vks-${year}-${month}-${paddedSeq}`;
};

export const Invoice = mongoose.model("Invoice", invoiceSchema);
