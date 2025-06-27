import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createInvoice,
  deleteInvoice,
  getInvoice,
  updateInvoice,
} from "../controllers/invoice.controller.js";

const router = Router();

router.route("/view").get(verifyJWT, upload.none(), getInvoice);
router.route("/create").post(verifyJWT, upload.none(), createInvoice);
router.route("/update").patch(verifyJWT, upload.none(), updateInvoice);
router.route("/delete").delete(verifyJWT, upload.none(), deleteInvoice);

export default router;
