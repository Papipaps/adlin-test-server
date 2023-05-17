import express, { Request } from "express";
import { BookingService } from "../service/booking.service";
import { ZodError, z } from "zod";
import { ErrorEnum } from "../errors/custom.errors";
import {
  tryCatch,
  validateAsString,
  validateInputStringAsDate,
  validateAsPositveNumber,
} from "../utils/controller.utils";

export const bookingRouter = express.Router();

interface BookingParams {
  roomId: string;
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
    page: validateAsPositveNumber().optional(),
    size: validateAsPositveNumber().optional(),
  });
};

bookingRouter.get(
  "/list",
  tryCatch(async (req, res) => {
    const parsed = bookingSearchSchema().safeParse(req.query);

    if (!parsed.success) {
      throw new ZodError(parsed.error.issues);
    }

    const {
      id,
      scheduledAt,
      scheduledUntil,
      userId,
      roomId,
      state,
      page = 1,
      size = 10,
    } = parsed.data;

    const skip = (page - 1) * size;

    const resData = await BookingService.get({
      id: id,
      roomId: roomId,
      userId: userId,
      scheduledAt: scheduledAt,
      scheduledUntil: scheduledUntil,
      state: state,
      skip: skip,
      limit: size,
    });
    if (resData.bookings.length === 0) {
      return res.status(204).send(resData);
    }
    return res.status(200).send(resData);
  })
);

bookingRouter.post(
  "/book",
  tryCatch(async (req, res) => {
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
  })
);

bookingRouter.patch(
  "/cancel",
  tryCatch(async (req, res) => {
    const params: { ids: string[]; userId: string } = req.body;

    const parsed = z
      .object({ ids: z.array(z.string()), userId: z.string() })
      .safeParse(params);

    if (!parsed.success) {
      throw new ZodError(parsed.error.issues);
    }

    const { ids, userId } = parsed.data;
    const canceledBookings = await BookingService.cancel(ids, userId, res);
    res.status(200).json({
      message: "Booking canceled successfully",
      bookings: canceledBookings,
    });
  })
);
