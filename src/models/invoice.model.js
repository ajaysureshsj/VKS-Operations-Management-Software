import mongoose from "mongoose";

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
    servicesProvided: serviceSchema,
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
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
