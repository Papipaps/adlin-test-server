import CustomError, { IError } from "./custom.errors";

class ValidationException extends CustomError {
  errors: IError[];
  constructor(errors: IError[]) {
    super("VALIDATION");
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
  serializeErrors(): { message: string; property?: string }[] {
    return this.errors.map((error) => ({
      message: error.message,
      property: error.property,
    }));
  }
}

export default ValidationException;
