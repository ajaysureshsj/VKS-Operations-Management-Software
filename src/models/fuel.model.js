import mongoose from "mongoose";

const fuelSchema = new mongoose.Schema(
  {
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    volumeInLiters: {
      type: Number,
      required: true,
    },
    pricePerLiter: {
      type: Number,
    },
    cost: {
      type: Number,
      required: true,
    },
    pump: {
      type: String,
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
      required: true,
    },
  },
  { timestamps: true }
);

export const Fuel = mongoose.model("Fuel", fuelSchema);
