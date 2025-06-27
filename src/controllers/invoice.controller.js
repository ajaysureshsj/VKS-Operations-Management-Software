import { Invoice } from "../models/invoice.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

const getInvoice = asyncHandler(async (req, res) => {
  const { invoiceId } = req.query;

  if (!invoiceId) {
    throw new ApiError(400, "invoiceId is required");
  }

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, invoice, "Invoice fetched successfully"));
});

const createInvoice = asyncHandler(async (req, res) => {
  const {
    invoiceDate,
    vehicle,
    client,
    servicesProvided,
    subTotal,
    subsidyPercentage,
    subsidyAmount,
    totalAmount,
    notes,
  } = req.body;

  if (
    [
      invoiceDate,
      vehicle,
      client,
      servicesProvided,
      subTotal,
      subsidyPercentage,
      subsidyAmount,
      totalAmount,
      notes,
    ].some((field) => field?.trim == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  let invoiceId = await Invoice.generateInvoiceId();
  invoiceId = invoiceId.toUpperCase();

  if (!invoiceId) {
    throw new ApiError(500, "Unable to create invoiceId");
  }

  const invoice = await Invoice.create({
    invoiceId,
    invoiceDate,
    vehicle,
    client,
    servicesProvided,
    subTotal,
    subsidyPercentage,
    subsidyAmount,
    totalAmount,
    notes,
    createdBy: req.admin._id,
  });

  if (!invoice) {
    throw new ApiError(500, "Unable to create invoice");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, invoice, "Invoice created successfully"));
});

const updateInvoice = asyncHandler(async (req, res) => {
  const { invoiceId } = req.query;
  const {
    invoiceDate,
    vehicle,
    client,
    servicesProvided,
    subTotal,
    subsidyPercentage,
    subsidyAmount,
    totalAmount,
    notes,
  } = req.body;

  if (!invoiceId) {
    throw new ApiError(400, "invoiceId is required");
  }
  if (
    [
      invoiceId,
      invoiceDate,
      vehicle,
      client,
      servicesProvided,
      subTotal,
      subsidyPercentage,
      subsidyAmount,
      totalAmount,
      notes,
    ].some((field) => field?.trim == "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const updatedInvoice = await Invoice.findByIdAndUpdate(
    invoiceId,
    {
      $set: {
        updatedBy: req.admin._id,
        invoiceDate,
        vehicle,
        client,
        servicesProvided,
        subTotal,
        subsidyPercentage,
        subsidyAmount,
        totalAmount,
        notes,
      },
    },
    { new: true }
  );

  if (!updateInvoice) {
    throw new ApiError(500, "Unable to update invoice");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedInvoice, "Invoice updated successfully"));
});

const deleteInvoice = asyncHandler(async (req, res) => {
  const { invoiceId } = req.query;
  if (!invoiceId) {
    throw new ApiError(400, "invoiceId is required");
  }

  const response = await Invoice.findByIdAndDelete(invoiceId);

  if (!response) {
    throw new ApiError(500, "Unable to delete invoice");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Invoice deleted successfully"));
});

export { getInvoice, createInvoice, updateInvoice, deleteInvoice };
