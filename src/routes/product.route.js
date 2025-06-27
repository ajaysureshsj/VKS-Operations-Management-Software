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

router.route("/get").get(verifyJWT, upload.none(), getProduct);
router.route("/add").post(verifyJWT, upload.none(), addProduct);
router.route("/update").patch(verifyJWT, upload.none(), updateProduct);
router.route("/delete").delete(verifyJWT, upload.none(), deleteProduct);

export default router;
