export interface IError {
  type?: string;
  message: string;
  error?: any;
  property?: string;
}

export enum ErrorEnum {
  SERVER_UNKNOWN = "Un serveur inconnu est survenu lors du traitement de la requête",
  VALIDATION_INVALID_NAME = "Le nom doit être compris entre 2 et 16 caractères",
  VALIDATION_BAD_REQUEST_INVALID_FORMAT = "Le format des données de votre requête est invalide",
  BOOKING_NOT_ALLOWED_MAX_BOOKING = "Vous avez excédé le nombre de reservation maximum",
  BOOKING_NOT_ALLOWED_PRIOR_DATE = `A room cannot be booked prior to this date`,
  BOOKING_NOT_ALLOWED_ROOM_ALREADY_BOOKED = "this room is already booked at this time",
  BOOKING_NOT_ALLOWED_TOO_LONG_PERIOD = `You can't book for more than a day`,
  ROOM_NOT_FOUND = "Room not found",
}

abstract class CustomError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; property?: string }[];
}

export default CustomError;
