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

router.route("/login").post(upload.none(), loginAdmin);

//************ Protected Routes *************//
router
  .route("/register")
  .post(verifyJWT, upload.single("avatar"), registerAdmin);
router.route("/logout").get(verifyJWT, upload.none(), logoutAdmin);
router.route("/refresh-access-token").post(refreshAccessToken);
router.route("/reset-password").post(verifyJWT, upload.none(), resetPassword);
router
  .route("/update-avatar")
  .post(verifyJWT, upload.single("avatar"), updateAdminAvatar);
router.route("/profile").get(verifyJWT, getAdminProfile);

export default router;
