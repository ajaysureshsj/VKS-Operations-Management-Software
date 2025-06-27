import { Router } from "express";
import {
  addClient,
  deleteClient,
  getClient,
  updateClient,
} from "../controllers/client.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/profile").get(verifyJWT, upload.none(), getClient);
router.route("/add").post(verifyJWT, upload.none(), addClient);
router.route("/update").patch(verifyJWT, upload.none(), updateClient);
router.route("/delete").delete(verifyJWT, upload.none(), deleteClient);

export default router;
