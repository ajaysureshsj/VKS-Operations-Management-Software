import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError.js";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath, resourceType) => {
  try {
    if (!localFilePath) {
      throw new ApiError(400, "File not found.");
    }
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: resourceType || "image",
    });
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath);
    throw new ApiError(500, "Unable to upload file to cloudinary.");
  }
};

const deleteFromCloudinary = async (publicId, resourceType) => {
  try {
    if (!publicId) return null;
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType || "image",
    });
    return response;
  } catch (error) {
    throw new ApiError(500, "Unable to delete file from cloudinary.");
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
