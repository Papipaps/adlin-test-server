class ValidationException extends Error {
  statusCode: number;
  errorCode: number;
  message: string;
  properties?: string[];
  constructor(
    message: string,
    statusCode: number,
    errorCode: number,
    properties?: string[]
  ) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.properties = properties;
  }
}

export default ValidationException;
