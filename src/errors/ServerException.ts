import CustomError, { IError } from "./custom.errors";

class ValidationError extends CustomError {
  errors: IError[];
  constructor(errors: IError[]) {
    super("SERVER");
    this.errors = errors;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
  serializeErrors(): { message: string; property?: string }[] {
    return this.errors.map((error) => ({
      message: error.message,
      property: error.property,
    }));
  }
}

export default ValidationError;
