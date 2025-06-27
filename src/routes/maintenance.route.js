import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  getMaintenanceReport,
  addMaintenanceReport,
  updateMaintenanceReport,
  deleteMaintenanceReport,
} from "../controllers/maintenance.controller.js";

const router = Router();

router.route("/get").get(verifyJWT, upload.none(), getMaintenanceReport);
router.route("/add").post(verifyJWT, upload.none(), addMaintenanceReport);
router
  .route("/update")
  .patch(verifyJWT, upload.none(), updateMaintenanceReport);
router
  .route("/delete")
  .delete(verifyJWT, upload.none(), deleteMaintenanceReport);

export default router;
