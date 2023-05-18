import express from "express";
import { ZodError, z } from "zod";
import { validateAsString, tryCatch } from "../utils/controller.utils";
import { randomUUID } from "crypto";
import AuthException from "../errors/AuthException";
import { error } from "console";
import { ErrorEnum } from "../errors/custom.errors";

export const authRouter = express.Router();

const optionSchema = z.object({
  id: validateAsString()
    .regex(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "l'id doit correspondre aux format UUID "
    )
    .optional(),
  token: validateAsString()
    .regex(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
      "le token doit correspondre aux format UUID "
    )
    .optional(),
  name: validateAsString()
    .min(3, "Le nom doit faire 3 caractères minimum")
    .max(32, "Le nom doit faire 32 caractères maximum"),
});

authRouter.post(
  "/",
  tryCatch(async (req, res) => {
    const parsed = optionSchema.safeParse(req.body);
    if (!parsed.success) {
      console.error(error);
      throw new AuthException(ErrorEnum.VALIDATION_INVALID_AUTH, false);
    }
    const { id, token } = parsed.data;
    return res.status(200).json({
      success: true,
      ...(!id && { id: randomUUID() }),
      ...(!token && { token: randomUUID() }),
    });
  })
);
