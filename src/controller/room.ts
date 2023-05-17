import express from "express";
import { RoomService } from "../service/room.service";
import { number, z } from "zod";
import { Request } from "express";
import ValidationException from "../errors/ValidationException";
import { validateStringAsNumber, validateInputStringAsDate, validateAsString, validateInputStringAsBoolean } from "./controller.utils";

export const roomRouter = express.Router();


const optionSchema = z.object({
  capacity: validateStringAsNumber().optional(),
  scheduledAt: validateInputStringAsDate().optional(),
  scheduledUntil: validateInputStringAsDate().optional(),
  id: validateAsString().optional(),
  equipments: validateAsString().optional(),
  hasAll: validateInputStringAsBoolean().optional(),
});

roomRouter.get("/list", async (req, res) => {
  const parsed = optionSchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json(parsed.error);
  }
  const { id, capacity, scheduledAt, scheduledUntil, equipments, hasAll } =
    parsed.data;

  try {
    const rooms = await RoomService.getRooms({
      id: id,
      capacity: capacity,
      scheduledAt: scheduledAt,
      scheduledUntil: scheduledUntil,
      equipments: equipments,
      hasAll: hasAll,
    });
    res.send(rooms);
  } catch (error) {
    throw new ValidationException([{type:"",message:""}])
  }
});
