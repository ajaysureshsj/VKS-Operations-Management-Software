import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../controllers/products.controller.js";

const router = Router();

router.route("/get-product").get(verifyJWT, upload.none(), getProduct);
router.route("/add-product").post(verifyJWT, upload.none(), addProduct);
router.route("/update-product").patch(verifyJWT, upload.none(), updateProduct);
router.route("/delete-product").delete(verifyJWT, upload.none(), deleteProduct);

export default router;
