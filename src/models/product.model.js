import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
    },
    hourlyRate: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
