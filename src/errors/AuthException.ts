class AuthException extends Error {
  success: boolean;
  constructor(message: string, success: boolean) {
    super(message);
    this.success = success;
  }
}

export default AuthException;
