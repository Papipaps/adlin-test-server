import express from "express";
import { RoomService } from "../service/room.service";
import { number, z } from "zod";
import { Request } from "express";

export const roomRouter = express.Router();

export const validateStringAsNumber = () =>
  z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number());

export const validateAsString = () => z.string().max(256);

export const validateInputStringAsDate = () =>
  z.preprocess((a) => new Date(z.string().parse(a)), z.date());
export const validateInputStringAsBoolean = () =>
  z.preprocess((a) => a === "true", z.boolean());

interface ReqQuery {
  capacity: number;
  scheduledAt: Date;
  scheduledUntil: Date;
  id: string;
  equipments: string;
  hasAll?: boolean;
}

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
  async (req: Request<unknown, unknown, unknown, ReqQuery>, res) => {
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
      return res.status(404).json({ message: "Room not found" });
    }
  }
);
