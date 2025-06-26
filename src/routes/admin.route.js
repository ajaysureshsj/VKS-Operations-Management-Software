import { Router } from "express";
import {
  getAdminProfile,
  loginAdmin,
  logoutAdmin,
  refreshAccessToken,
  registerAdmin,
  resetPassword,
  updateAdminAvatar,
} from "../controllers/admin.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login-admin").post(upload.none(), loginAdmin);

//************ Protected Routes *************//
router
  .route("/register-admin")
  .post(verifyJWT, upload.single("avatar"), registerAdmin);
router.route("/logout-admin").get(verifyJWT, upload.none(), logoutAdmin);
router.route("/refresh-access-token-admin").post(refreshAccessToken);
router
  .route("/reset-password-admin")
  .post(verifyJWT, upload.none(), resetPassword);
router
  .route("/update-avatar-admin")
  .post(verifyJWT, upload.single("avatar"), updateAdminAvatar);
router.route("/get-profile-admin").get(verifyJWT, getAdminProfile);

export default router;
