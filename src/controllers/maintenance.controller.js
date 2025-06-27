import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Maintenance } from "../models/maintenance.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const getMaintenanceReport = asyncHandler(async (req, res) => {
  const { maintenanceId } = req.query;

  if (!maintenanceId) {
    throw new ApiError(400, "maintenanceId is required ");
  }

  const maintenanceReport = await Maintenance.findById(maintenanceId);

  if (!maintenanceReport) {
    throw new ApiError(404, "Maintenance details not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        maintenanceReport,
        "Maintenance details fetched successfully"
      )
    );
});

const addMaintenanceReport = asyncHandler(async (req, res) => {
  const { product, description, cost, notes } = req.body;

  if (!product || !description || !cost || !notes) {
    throw new ApiError(400, "All fields are required");
  }

  const createdMaintenanceReport = await Maintenance.create({
    createdBy: req.admin._id,
    product,
    description,
    cost,
    notes,
  });

  if (!createdMaintenanceReport) {
    throw new ApiError(500, "Unable to add the Maintenance");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        createdMaintenanceReport,
        "New Maintenance Report added successfully"
      )
    );
});

const updateMaintenanceReport = asyncHandler(async (req, res) => {
  const { product, description, cost, notes } = req.body;
  const { maintenanceId } = req.query;

  if (!product || !description || !cost || !notes) {
    throw new ApiError(400, "All fields are required");
  }

  const MaintenanceReport = await Maintenance.findById(maintenanceId);

  if (!MaintenanceReport) {
    throw new ApiError(400, "Maintenance purchase does not exists!");
  }

  const updatedMaintenanceReport = await Maintenance.findByIdAndUpdate(
    maintenanceId,
    {
      $set: {
        updatedBy: req.admin._id,
        product,
        description,
        cost,
        notes,
      },
    },
    { new: true }
  );

  if (!updatedMaintenanceReport) {
    throw new ApiError(500, "Unable to update maintenance report!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedMaintenanceReport,
        "Maintenance report updated successfully"
      )
    );
});

const deleteMaintenanceReport = asyncHandler(async (req, res) => {
  const { maintenanceId } = req.query;

  if (!maintenanceId) {
    throw new ApiError(400, "MaintenanceId is required ");
  }

  const response = await Maintenance.findByIdAndDelete(maintenanceId);

  if (!response) {
    throw new ApiError(404, "Unable to delete, maintenance report not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, response, "Maintenance report deleted successfully")
    );
});

export {
  getMaintenanceReport,
  addMaintenanceReport,
  updateMaintenanceReport,
  deleteMaintenanceReport,
};
