import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
import adminRouter from "./routes/admin.route.js";
import fuelRouter from "./routes/fuel.routes.js";
import productRouter from "./routes/product.route.js";

//routes declaration
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/fuel", fuelRouter);
app.use("/api/v1/product", productRouter);

export { app };
