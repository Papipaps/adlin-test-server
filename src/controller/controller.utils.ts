import { z } from "zod";

export const validateStringAsNumber = () =>
  z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number());

export const validateAsString = () => z.string().min(1).max(256);

export const validateInputStringAsDate = () =>
  z.preprocess((a) => new Date(z.string().parse(a)), z.date());

export const validateInputStringAsBoolean = () =>
  z.preprocess((a) => a === "true" || "false", z.boolean());
