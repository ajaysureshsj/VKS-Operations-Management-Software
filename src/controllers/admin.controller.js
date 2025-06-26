import fs from "fs";
import { Admin } from "../models/admin.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, department } = req.body;
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  if ((!fullName, !email, !phone, !password, !role, !department)) {
    throw new ApiError(400, "All fields are required!");
  }

  const existingAdmin = await Admin.find({ email: email });
  if (existingAdmin.length == 1) {
    fs.unlinkSync(avatarLocalPath);
    throw new ApiError(400, "Admin already exists!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  if (!avatar) {
    throw new ApiError(400, "Unable to upload avatar to cloudinary");
  }

  const admin = await Admin.create({
    fullName,
    email,
    phone,
    password,
    role,
    department,
    avatar: {
      url: avatar.url,
      publicId: avatar.public_id,
    },
  });

  const newAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  if (!newAdmin) {
    throw new ApiError(
      500,
      "Unable to create a new admin at this moment, please try again later"
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(201, newAdmin, "New admin created successfully."));
});

const loginAdmin = asyncHandler(async (req, res) => {});

export { registerAdmin, loginAdmin };
