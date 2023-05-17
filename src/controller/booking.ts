import express, { Request } from "express";
import { BookingService } from "../service/booking.service";
import { z } from "zod";
import ServerException from "../errors/ServerException";
import { ErrorEnum } from "../errors/custom.errors";
import {
  validateAsString,
  validateInputStringAsDate,
} from "./controller.utils";

export const bookingRouter = express.Router();

interface BookingParams { 
  roomId:string;
  userId: string;
  scheduledAt: Date;
  scheduledUntil: Date;
}

const bookingSchema = () => {
  return z.object({
    scheduledAt: validateInputStringAsDate(),
    scheduledUntil: validateInputStringAsDate(),
    userId: validateAsString(),
    roomId: validateAsString(),
  });
};
const bookingSearchSchema = () => {
  return z.object({
    id: validateAsString().optional(),
    state: z
      .string()
      .refine((value) => value === "ONGOING" || value === "CLOSED", {
        message: "Expected 'state' to be either 'ONGOING' or 'CLOSED'",
      })
      .optional(),
    scheduledAt: validateInputStringAsDate().optional(),
    scheduledUntil: validateInputStringAsDate().optional(),
    userId: validateAsString().optional(),
    roomId: validateAsString().optional(),
  });
};

bookingRouter.get("/list", async (req, res) => {
  const parsed = bookingSearchSchema().safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({
      message: ErrorEnum.VALIDATION_BAD_REQUEST_INVALID_FORMAT,
      error: parsed.error,
    });
  }

  const { id, scheduledAt, scheduledUntil, userId, roomId, state } =
    parsed.data;
  try {
    const rooms = await BookingService.get({
      id: id,
      roomId: roomId,
      userId: userId,
      scheduledAt: scheduledAt,
      scheduledUntil: scheduledUntil,
      state: state,
    });
    res.send(rooms);
  } catch (error) {
    throw new ServerException([
      { type: "UNKNOWN", message: ErrorEnum.SERVER_UNKNOWN },
    ]);
  }
});

bookingRouter.post("/book", async (req, res) => {
  try {
    const params: BookingParams = req.body; 
    const parsed = bookingSchema().safeParse(params);

    if (!parsed.success) {
      return res.status(400).json({
        message: ErrorEnum.VALIDATION_BAD_REQUEST_INVALID_FORMAT,
        error: parsed.error,
      });
    }
    const { roomId, scheduledAt, scheduledUntil, userId } = parsed.data;

    if (roomId && userId && scheduledAt && scheduledUntil) {
      return await BookingService.book(
        roomId,
        userId,
        res,
        scheduledAt,
        scheduledUntil
      );
    }
  } catch (error) {
    throw new ServerException([
      { type: "UNKNOWN", message: ErrorEnum.SERVER_UNKNOWN },
    ]);
  }
});

bookingRouter.delete("/cancel", async (req, res) => {
  const params: { ids: string[]; userId: string } = req.body;

  const parsed = z
    .object({ ids: z.array(z.string()), userId: z.string() })
    .safeParse(params);
  if (!parsed.success) {
    return res.status(400).json({
      message: ErrorEnum.VALIDATION_BAD_REQUEST_INVALID_FORMAT,
      error: parsed.error,
    });
  }
  const { ids, userId } = parsed.data;
  try {
    const canceledBookings = await BookingService.cancel(ids, userId, res);
    res.status(200).json({
      message: "Booking canceled successfully",
      bookings: canceledBookings,
    });
  } catch (error) {
    throw new ServerException([
      { type: "UNKNOWN", message: ErrorEnum.SERVER_UNKNOWN },
    ]);
  }
});
