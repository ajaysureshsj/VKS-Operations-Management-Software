import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Driver } from "../models/driver.model.js";

const getDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.query;

  if (!driverId) {
    throw new ApiError(400, "driverId is required ");
  }

  const driverDetails = await Driver.findById(driverId);

  if (!driverDetails) {
    throw new ApiError(404, "Driver not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, driverDetails, "Driver details fetched successfully")
    );
});

const addDriver = asyncHandler(async (req, res) => {
  const { fullName, phone, address } = req.body;

  if (!fullName || !phone || !address) {
    throw new ApiError(400, "All fields are required");
  }

  const createdDriver = await Driver.create({
    createdBy: req.admin._id,
    fullName,
    phone,
    address,
  });

  if (!createdDriver) {
    throw new ApiError(500, "Unable to add the driver");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdDriver, "New driver added successfully"));
});

const updateDriver = asyncHandler(async (req, res) => {
  const { fullName, phone, address } = req.body;
  const { driverId } = req.query;

  if (!fullName || !phone || !address || !driverId) {
    throw new ApiError(400, "All fields are required");
  }

  const driverDetails = await Driver.findById(driverId);

  if (!driverDetails) {
    throw new ApiError(400, "Driver purchase does not exists!");
  }

  const updatedDriverDetails = await Driver.findByIdAndUpdate(
    driverId,
    {
      $set: {
        updatedBy: req.admin._id,
        fullName,
        phone,
        address,
      },
    },
    { new: true }
  );

  if (!updatedDriverDetails) {
    throw new ApiError(500, "Unable to update Driver details!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedDriverDetails,
        "Driver details updated successfully"
      )
    );
});

const deleteDriver = asyncHandler(async (req, res) => {
  const { driverId } = req.query;

  if (!driverId) {
    throw new ApiError(400, "driverId is required ");
  }

  const response = await Driver.findByIdAndDelete(driverId);

  if (!response) {
    throw new ApiError(404, "Unable to delete, Driver not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Driver deleted successfully"));
});

export { getDriver, addDriver, updateDriver, deleteDriver };
