import fs from "fs";
import { Admin } from "../models/admin.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const admin = await Admin.findById(userId);
    const accessToken = await admin.generateAccessToken();
    const refreshToken = await admin.generateRefreshToken();

    admin.lastLogin = Date.now;
    admin.isActive = true;
    admin.refreshToken = refreshToken;
    await admin.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while creating tokens, ");
  }
};

const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, phone, password, role, department } = req.body;
  const avatarLocalPath = req.file?.path;

  if (req.admin.role != "superadmin") {
    fs.unlinkSync(avatarLocalPath);
    throw new ApiError(401, "Only a super-admin can create a new admin");
  }

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

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }

  const admin = await Admin.findOne({ email });

  if (!admin) {
    throw new ApiError(404, "Admin does not exists");
  }

  const isPasswordCorrect = admin.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid admin credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    admin._id
  );

  const loggedInAdmin = await Admin.findById(admin._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInAdmin, "Admin logged in successfully"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const admin = await Admin.findByIdAndUpdate(
    req.admin._id,
    {
      $set: {
        refreshToken: undefined,
        isActive: false,
      },
    },
    { new: true }
  );
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully!"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const clientRefreshToken =
      ref.cookies?.refreshToken ||
      req.header("Authorization")?.replace("Bearer", "");

    if (!clientRefreshToken) {
      throw new ApiError(401, "Unauthorized Request!");
    }

    const decodedToken = jwt.verify(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const admin = await Admin.findById(decodedToken?._id);

    if (!admin) {
      throw new ApiError(401, "Invalid refreshToken!");
    }

    if (clientRefreshToken !== admin?.refreshToken) {
      throw new ApiError(401, "Refresh Token is Expired or Used");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      admin._id
    );

    res
      .status(200)
      .cookie("Access Toke", accessToken, options)
      .cookie("Refresh Token", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "accessToken refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const admin = await Admin.findById(req.admin?._id);

  if (!admin) {
    throw new ApiError(401, "Unauthorized request");
  }

  const isPasswordCorrect = await admin.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Incorrect old password");
  }

  admin.password = newPassword;
  await admin.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully!"));
});

const updateAdminAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(
      500,
      "Something went wrong, unable to upload avatar to cloudinary"
    );
  }

  const response = await deleteFromCloudinary(req.admin.avatar.publicId);
  console.log(response);

  const admin = await Admin.findByIdAndUpdate(
    req.admin?._id,
    {
      $set: {
        avatar: {
          url: avatar.url,
          publicId: avatar.public_id,
        },
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully!"));
});

const getAdminProfile = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(200, req.admin, "Admin profile fetched successfully")
    );
});

export {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  resetPassword,
  updateAdminAvatar,
  getAdminProfile,
};
