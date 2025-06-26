import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error in running server", error);
      throw error;
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(
        `\n🚀 Server is running on PORT: ${process.env.PORT || 3000}\n Mode: ${process.env.MODE}`
      );
    });
  })
  .catch((err) => {
    console.log("MongoDB Connection Failed!", err);
  });
