import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
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
import maintenanceRouter from "./routes/maintenance.route.js";
import driverRouter from "./routes/driver.route.js";
import clientRouter from "./routes/client.route.js";
import invoiceRouter from "./routes/invoice.route.js";

//routes declaration
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/fuel", fuelRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/maintenance", maintenanceRouter);
app.use("/api/v1/driver", driverRouter);
app.use("/api/v1/client", clientRouter);
app.use("/api/v1/invoice", invoiceRouter);

export { app };
