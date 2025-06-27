import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createInvoice } from "../controllers/invoice.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.none(), createInvoice);

export default router;
