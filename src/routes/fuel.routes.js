import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addFuelPurchase,
  deleteFuelPurchase,
  getFuelPurchase,
  updateFuelPurchase,
} from "../controllers/fuel.controller.js";

const router = Router();

//************ Protected Routes *************//
router
  .route("/get-fuel-purchase-details")
  .get(verifyJWT, upload.none(), getFuelPurchase);

router
  .route("/add-new-fuel-purchase")
  .post(verifyJWT, upload.none(), addFuelPurchase);

router
  .route("/update-fuel-purchase")
  .patch(verifyJWT, upload.none(), updateFuelPurchase);

router
  .route("/delete-fuel-purchase")
  .delete(verifyJWT, upload.none(), deleteFuelPurchase);

export default router;
