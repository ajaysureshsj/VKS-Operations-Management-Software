import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Client } from "../models/client.model.js";

const getClient = asyncHandler(async (req, res) => {
  const { clientId } = req.query;

  if (!clientId) {
    throw new ApiError(400, "clientId is required ");
  }

  const clientDetails = await Client.findById(clientId);

  if (!clientDetails) {
    throw new ApiError(404, "Client not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, clientDetails, "Client details fetched successfully")
    );
});

const addClient = asyncHandler(async (req, res) => {
  const { fullName, phone, address, isMember, membershipId } = req.body;

  if ((!fullName || !phone || !address, !isMember, !membershipId)) {
    throw new ApiError(400, "All fields are required");
  }

  const createdClient = await Client.create({
    createdBy: req.admin._id,
    fullName,
    phone,
    address,
    isMember,
    membershipId,
  });

  if (!createdClient) {
    throw new ApiError(500, "Unable to add the Client");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, createdClient, "New Client added successfully"));
});

const updateClient = asyncHandler(async (req, res) => {
  const { fullName, phone, address, isMember, membershipId } = req.body;
  const { clientId } = req.query;

  if (!fullName || !phone || !address || !isMember || !clientId) {
    throw new ApiError(400, "All fields are required");
  }

  const ClientDetails = await Client.findById(clientId);

  if (!ClientDetails) {
    throw new ApiError(404, "Client  does not exists!");
  }

  const updatedClientDetails = await Client.findByIdAndUpdate(
    clientId,
    {
      $set: {
        updatedBy: req.admin._id,
        fullName,
        phone,
        address,
        isMember,
        membershipId,
      },
    },
    { new: true }
  );

  if (!updatedClientDetails) {
    throw new ApiError(500, "Unable to update Client details!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedClientDetails,
        "Client details updated successfully"
      )
    );
});

const deleteClient = asyncHandler(async (req, res) => {
  const { clientId } = req.query;

  if (!clientId) {
    throw new ApiError(400, "clientId is required ");
  }

  const response = await Client.findByIdAndDelete(clientId);

  if (!response) {
    throw new ApiError(404, "Unable to delete, Client not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Client deleted successfully"));
});

export { getClient, addClient, updateClient, deleteClient };
