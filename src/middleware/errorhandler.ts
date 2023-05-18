import e, { Request, Response, NextFunction } from "express";
// import ValidationException from "../errors/ValidationException";
// import ServerException from "../errors/ServerException";
import {
  INVALID_REQUEST_DATA,
  DATABASE_TRANSACTION_ERROR,
  ErrorEnum,
  IError,
  UNKNOW_SERVER_ERROR,
} from "../errors/custom.errors";
import { ZodError } from "zod";
import AppException from "../errors/AppException";
import AuthException from "../errors/AuthException";
import ValidationException from "../errors/ValidationException";

const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(`\n\t[${new Date().toISOString()}] ERROR HANDLER :::: ${error}`);

  const errorObject: IError = {
    type: "Server error",
    message: ErrorEnum.SERVER_UNKNOWN,
    errorCode: UNKNOW_SERVER_ERROR,
  };

  if (error instanceof AppException) {
    errorObject.type = "Operational error";
    errorObject.message = error.message;
    errorObject.errorCode = error.errorCode;
    return res.status(error.statusCode).send(errorObject);
  }

  if (error.name === "MongoServerError") {
    errorObject.type = "Transaction Error";
    errorObject.errorCode = DATABASE_TRANSACTION_ERROR;
    return res.status(500).send(errorObject);
  }

  if (error instanceof AuthException) {
    errorObject.type = "Authentication error";
    errorObject.message = error.message;
    return res.status(401).send({ ...errorObject, success: false });
  }

  if (error instanceof ValidationException) {
    errorObject.type = "Validation error";
    errorObject.properties = error.properties;
    errorObject.message = errorObject.message;
    errorObject.errorCode = error.errorCode;
    return res.status(400).send(errorObject);
  }

  return res.status(500).send(errorObject);
};

export default errorHandler;
