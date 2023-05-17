import express from "express";
import { RoomService } from "../service/room.service";
import { ZodError, number, z } from "zod";
import { Request } from "express";
// import ValidationException from "../errors/ValidationException";
import {
  validateStringAsNumber,
  validateInputStringAsDate,
  validateAsString,
  validateInputStringAsBoolean,
  tryCatch,
} from "../utils/controller.utils";
import AppException from "../errors/AppException";
import { ErrorEnum, UNKNOW_SERVER_ERROR } from "../errors/custom.errors";

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
      throw new ZodError(parsed.error.issues);
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
    if (rooms.length === 0) {
      return res.status(204).send(rooms);
    }
    return res.status(200).send(rooms);
  })
);
