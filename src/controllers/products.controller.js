import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const getProduct = asyncHandler(async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    throw new ApiError(400, "productId is required ");
  }

  const productDetails = await Product.findById(productId);

  if (!productDetails) {
    throw new ApiError(404, "Product not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        productDetails,
        "Product details fetched successfully"
      )
    );
});

const addProduct = asyncHandler(async (req, res) => {
  const { productName, hourlyRate } = req.body;

  if ((!productName, !hourlyRate)) {
    throw new ApiError(400, "All fields are required");
  }

  const existingProduct = await Product.find({ productName });

  if (existingProduct.length != 0) {
    throw new ApiError(400, "Product already exists");
  }

  const createdProduct = await Product.create({
    createdBy: req.admin._id,
    updatedBy: undefined,
    productName,
    hourlyRate,
  });

  if (!createdProduct) {
    throw new ApiError(500, "Unable to add the product");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(201, createdProduct, "New product added successfully")
    );
});

const updateProduct = asyncHandler(async (req, res) => {
  const { productName, hourlyRate } = req.body;
  const { productId } = req.query;

  if (!(productName, hourlyRate, productId)) {
    throw new ApiError(400, "All fields are required");
  }

  const productDetails = await Product.findById(productId);

  if (!productDetails) {
    throw new ApiError(400, "Product purchase does not exists!");
  }

  const updatedProductDetails = await Product.findByIdAndUpdate(
    productId,
    {
      $set: {
        updatedBy: req.admin._id,
        productName,
        hourlyRate,
      },
    },
    { new: true }
  );

  if (!updatedProductDetails) {
    throw new ApiError(500, "Unable to update product details!");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProductDetails,
        "Product details updated successfully"
      )
    );
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.query;

  if (!productId) {
    throw new ApiError(400, "productId is required ");
  }

  const response = await Product.findByIdAndDelete(productId);

  if (!response) {
    throw new ApiError(404, "Unable to delete, product not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, response, "Product deleted successfully"));
});

export { getProduct, addProduct, updateProduct, deleteProduct };
