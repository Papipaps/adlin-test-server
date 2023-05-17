import { IError } from "./custom.errors";

class AppException extends Error {
  statusCode: number;
  errorCode: number;
  message: string;
  constructor(
    message: string,
    statusCode: number,
    errorCode: number
  ) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export default AppException;
