import express from "express";
import { RoomService } from "../service/room.service";
import { z } from "zod";
import {
  validateStringAsNumber,
  validateInputStringAsDate,
  validateAsString,
  validateInputStringAsBoolean,
  tryCatch,
} from "../utils/controller.utils";
import { ErrorEnum, INVALID_REQUEST_DATA } from "../errors/custom.errors";
import ValidationException from "../errors/ValidationException";

export const roomRouter = express.Router();

const optionSchema = z.object({
  capacity: validateStringAsNumber().optional(),
  scheduledAt: validateInputStringAsDate().optional(),
  scheduledUntil: validateInputStringAsDate().optional(),
  id: validateAsString().optional(),
  equipments: validateAsString().optional(),
  hasAll: validateInputStringAsBoolean().optional(),
});

roomRouter.get(
  "/list",
  tryCatch(async (req, res) => {
    const parsed = optionSchema.safeParse(req.query);
    if (!parsed.success) {
      throw new ValidationException(
        ErrorEnum.VALIDATION_BAD_REQUEST_INVALID_FORMAT,
        400,
        INVALID_REQUEST_DATA,
        parsed.error.issues?.map((i) => i.path.join(" "))
      );
    }
    const { id, capacity, scheduledAt, scheduledUntil, equipments, hasAll } =
      parsed.data;

    const rooms = await RoomService.getRooms({
      id: id,
      capacity: capacity,
      scheduledAt: scheduledAt,
      scheduledUntil: scheduledUntil,
      equipments: equipments,
      hasAll: hasAll,
    });
    return res.status(200).send(rooms);
  })
);
