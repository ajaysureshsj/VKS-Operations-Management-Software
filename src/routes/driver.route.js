import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addDriver,
  deleteDriver,
  getDriver,
  updateDriver,
} from "../controllers/driver.controller.js";

const router = Router();

router.route("/profile").get(verifyJWT, upload.none(), getDriver);
router.route("/add").post(verifyJWT, upload.none(), addDriver);
router.route("/update").patch(verifyJWT, upload.none(), updateDriver);
router.route("/delete").delete(verifyJWT, upload.none(), deleteDriver);

export default router;
