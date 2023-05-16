import { NextFunction, Request, Response } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  console.log(
    `${now.toISOString()} - ${req.method} ${req.url} - from ${
      req.socket.remoteAddress
    }`
  );
  next();
};
