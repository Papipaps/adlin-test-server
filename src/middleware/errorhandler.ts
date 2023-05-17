import { Request, Response, NextFunction } from "express";
import ValidationException from "../errors/ValidationException";
import ServerException from "../errors/ServerException";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
    console.log(err)
  if (err instanceof ValidationException) {
    return res.status(400).send({ errors: err.serializeErrors() });
  }
  if (err instanceof ServerException) {
    return res.status(500).send({ errors: err.serializeErrors() });
  }
  return res.send({ errors: [{ message: "Unknown error occured" }] });
};

export default errorHandler;
