import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    isMember: {
      type: Boolean,
      required: true,
      default: false,
      enum: [true, false],
    },
    membershipId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Client = mongoose.model("Client", clientSchema);
