import { NextFunction, Request, Response, request, response } from "express";
import { z } from "zod";

export const validateStringAsNumber = () =>
  z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number());

export const validateAsPositveNumber = () =>
  z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive());

export const validateAsString = () => z.string().min(1).max(256);

export const validateInputStringAsDate = () =>
  z.preprocess((a) => new Date(z.string().parse(a)), z.date());

export const validateInputStringAsBoolean = () =>
  z.preprocess((a) => a === "true" || "false", z.boolean());

export const tryCatch =
  (controller: (request: Request, response: Response) => Promise<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controller(req, res);
    } catch (error) {
      return next(error);
    }
  };
