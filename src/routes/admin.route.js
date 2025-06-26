import { Router } from "express";
import {
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  registerAdmin,
  resetPassword,
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login-admin").post(upload.none(), loginAdmin);
router
  .route("/register-admin")
  .post(verifyJWT, upload.single("avatar"), registerAdmin);
router.route("/logout-admin").get(verifyJWT, upload.none(), logoutAdmin);
router.route("/refresh-access-token-admin").post(refreshAccessToken);
router
  .route("/reset-password-admin")
  .post(verifyJWT, upload.none(), resetPassword);
export default router;
