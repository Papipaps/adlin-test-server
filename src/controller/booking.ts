import express, { Request } from "express";
import { BookingService } from "../service/booking.service";
import { validateInputStringAsDate, validateAsString } from "./room";
import { z } from "zod";
import { STATE } from "../model/booking.model";

export const bookingRouter = express.Router();

export interface SearchBookingParams {
  id?: string;
  roomId?: string;
  userId?: string;
  scheduledAt?: Date;
  scheduledUntil?: Date;
  state?: string;
}
interface BookingParams {
  id: string;
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
    state: validateAsString().optional(),
    scheduledAt: validateInputStringAsDate().optional(),
    scheduledUntil: validateInputStringAsDate().optional(),
    userId: validateAsString().optional(),
    roomId: validateAsString().optional(),
  });
};

bookingRouter.get(
  "/list",
  async (req: Request<{}, {}, {}, SearchBookingParams>, res) => {
    const parsed = bookingSearchSchema().safeParse(req.query);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Bad input request", error: parsed.error });
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
      return res
        .status(500)
        .json({ message: "Internal server error", error: error });
    }
  }
);

bookingRouter.post("/book", async (req, res) => {
  try {
    const params: BookingParams = req.body;
    console.log(params);
    const parsed = bookingSchema().safeParse(params);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Bad input request", error: parsed.error });
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
    return res
      .status(500)
      .json({ message: "Internal server error", error: error });
  }
});

bookingRouter.delete("/cancel", async (req, res) => {
  const params: { ids: string[]; userId: string } = req.body;

  try {
    const parsed = z
      .object({ ids: z.array(z.string()), userId: z.string() })
      .safeParse(params);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Bad input request", error: parsed.error });
    }
    const { ids, userId } = parsed.data;
    console.log(parsed.data)
    const canceledBookings = await BookingService.cancel(ids, userId, res);
    res.status(200).json({
      message: "Booking canceled successfully",
      bookings: canceledBookings,
    });
  } catch (error) {
    return res.status(400).json({ message: "Bad input request", error: error });
  }
});
