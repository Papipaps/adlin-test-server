import express from "express";
import { logger } from "./middleware/logger";
import { roomRouter } from "./controller/room";
import { bookingRouter } from "./controller/booking";
import cors from "cors";
import { connectDB } from "./db";
import { populateData } from "./initData";
import errorHandler from "./middleware/errorhandler";
  const app = express();
const port = 3000;

app.use(logger);
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 
app.use("/rooms", roomRouter);
app.use("/booking", bookingRouter);
app.use(errorHandler);

connectDB()
  .then(() => {
    app.listen(port, () => {
      populateData();
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
  });
