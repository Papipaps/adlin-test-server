import express from "express";
import { logger } from "./middleware/logger";
import { roomRouter } from "./controller/room";
import { bookingRouter } from "./controller/booking";
import cors from "cors";
import { connectDB } from "./db";
import { populateData } from "./initData";
import errorHandler from "./middleware/errorhandler";
import { tryCatch } from "./utils/controller.utils";
// import ValidationError from "./errors/ServerException";
import { ZodError, z } from "zod";
import { ErrorEnum } from "./errors/custom.errors";
import AppException from "./errors/AppException";
import { authRouter } from "./controller/auth";
import securityFilter from "./middleware/securityFilter";
export const app = express();
const port = 3000;

//MIDDLEWARE
app.use(logger);
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityFilter) 
/*
  app.use(securityFilter) -> Récupération de l'utilisateur et de ses roles
  On vérifie les authorisationS de utilisateur pour chaque route qu'il essaie d'accéder.
*/
 


//CONTROLLERS
app.use("/auth", authRouter);
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
