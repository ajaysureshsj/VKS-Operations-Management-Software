import { Fuel } from "../models/fuel.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getFuelPurchase = asyncHandler(async (req, res) => {
  const { fuelPurchaseId } = req.query;

  const fuelPurchaseDetails = await Fuel.findById(fuelPurchaseId);

  if (!fuelPurchaseDetails) {
    throw new ApiError(404, "Fuel purchase not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        fuelPurchaseDetails,
        "Fuel purchase details fetched successfully"
      )
    );
});

const addFuelPurchase = asyncHandler(async (req, res) => {
  const { volumeInLiters, pricePerLiter, cost, pump, notes } = req.body;

  if ((!volumeInLiters, !pricePerLiter, !cost, !pump, !notes)) {
    throw new ApiError(400, "All fields are required");
  }

  const response = await Fuel.create({
    createdBy: req.admin._id,
    volumeInLiters,
    pricePerLiter,
    cost,
    pump,
    notes,
  });

  if (!response) {
    throw new ApiError(500, "Unable to add this fuel purchase.");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, response, "New fuel purchase added successfully")
    );
});

const updateFuelPurchase = asyncHandler(async (req, res) => {
  const { volumeInLiters, pricePerLiter, cost, pump, notes } = req.body;
  const { fuelPurchaseId } = req.query;

  if ((!volumeInLiters, !pricePerLiter, !cost, !pump, !notes)) {
    throw new ApiError(400, "All fields are required");
  }

  const fuelPurchase = await Fuel.findById(fuelPurchaseId);

  if (!fuelPurchase) {
    throw new ApiError(400, "Fuel purchase does not exists!");
  }

  const updatedFuelPurchase = await Fuel.findByIdAndUpdate(
    fuelPurchaseId,
    {
      $set: {
        updatedBy: req.admin._id,
        volumeInLiters,
        pricePerLiter,
        cost,
        pump,
        notes,
      },
    },
    { new: true }
  );

  if (!updateFuelPurchase) {
    throw new ApiError(500, "Unable to update fuel purchase!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedFuelPurchase,
        "Fuel purchase updated successfully"
      )
    );
});

const deleteFuelPurchase = asyncHandler(async (req, res) => {
  const { fuelPurchaseId } = req.query;

  const response = await Fuel.findByIdAndDelete(fuelPurchaseId);

  if (!response) {
    throw new ApiError(404, "Unable to delete, Fuel purchase not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Fuel purchase deleted successfully"));
});

export {
  getFuelPurchase,
  addFuelPurchase,
  updateFuelPurchase,
  deleteFuelPurchase,
};
