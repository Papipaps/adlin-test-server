export interface IError {
  message: string;
  statusCode?:number;
  errorCode: number;
  type?: string;
  errors?: any[];
  property?: string;
}

export enum ErrorEnum {
  SERVER_UNKNOWN = "Une erreur inconnue est survenu lors du traitement de la requête",
  VALIDATION_INVALID_AUTH = "Vos identifiants sont incorrects",
  VALIDATION_BAD_REQUEST_INVALID_FORMAT = "Le format des données de votre requête est invalide",
  BOOKING_NOT_ALLOWED_MAX_BOOKING = "Vous avez excédé le nombre de reservation maximum",
  BOOKING_NOT_ALLOWED_PRIOR_DATE = `Une salle ne peut pas être reservée avant la date du jour`,
  BOOKING_NOT_ALLOWED_ROOM_ALREADY_BOOKED = "Cette salle est déjà reservée",
  BOOKING_NOT_ALLOWED_TOO_LONG_PERIOD = `Une salle ne peut pas être reservé pendant plus d'une journée`,
  ROOM_NOT_FOUND = "Cette salle n'existe pas",
  BOOK_NOT_FOUND = "Aucune reservation trouvée",
}


export const ENTITY_NOT_FOUND = 204;
export const REQUIREMENT_NOT_MET = 409;
export const BAD_REQUEST = 400;
export const ENTITY_CREATED = 201;
export const UNKNOW_SERVER_ERROR = 500; 
export const DATABASE_TRANSACTION_ERROR = 503; 