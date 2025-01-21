import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./env",
});

connectDB()
  .then(() => {
    app.on("erorr", (error) => {
      console.log("ERROR :", error);
      throw error;
    });
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running at port : ${process.env.PORT} `);
    });
  })
  .catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
  });
