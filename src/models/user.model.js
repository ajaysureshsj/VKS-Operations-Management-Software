import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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

export const User = mongoose.model("User", userSchema);
