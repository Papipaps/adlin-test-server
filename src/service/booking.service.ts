import { Booking, BookingModel } from "../model/booking.model";
import { Response } from "express";
import { Room, RoomModel } from "../model/room.model";
import { BookMapper } from "../mapper/booking/booking.mapper";
import { ErrorEnum } from "../errors/custom.errors";

export interface SearchBookingParams {
  id?: string;
  roomId?: string;
  userId?: string;
  scheduledAt?: Date;
  scheduledUntil?: Date;
  state?: string;
}

async function findReservedBookings(
  options: SearchBookingParams
): Promise<Booking[]> {
  const { id, userId, scheduledAt, scheduledUntil } = options;

  const query = {
    ...(id && { _id: id }),
    ...(userId && { user_id: userId }),
    state: "ONGOING",
    ...(scheduledAt &&
      scheduledUntil && {
        $or: [
          {
            scheduledAt: { $gte: scheduledAt, $lt: scheduledUntil },
          },
          {
            scheduledUntil: { $gt: scheduledAt, $lte: scheduledUntil },
          },
          {
            $and: [
              { scheduledAt: { $lte: scheduledAt } },
              { scheduledUntil: { $gte: scheduledUntil } },
            ],
          },
        ],
      }),
  };

  return await BookingModel.find(query);
}

async function get(options: SearchBookingParams) {
  const { id, userId, scheduledAt, scheduledUntil, roomId, state } = options;
  const now = new Date();
  const at = scheduledAt?.getTime();
  const until = scheduledUntil?.getTime();

  const query = {
    ...(id && { _id: id }),
    ...(roomId && { room: roomId }),
    ...(userId && { user_id: userId }),
    ...(state && { state: state }),
    ...(at && until && at < until && { scheduledAt: { $gte: scheduledAt } }),
    ...(until &&
      until > now.getTime() && { scheduledUntil: { $lte: scheduledUntil } }),
  };
  const bookings: Booking[] = await BookingModel.find(query).populate("room");
  return BookMapper.toDTOs(bookings);
}

async function book(
  roomId: string,
  userId: string,
  res: Response,
  scheduledAt: Date,
  scheduledUntil: Date
): Promise<Response<any, Record<string, any>>> {
  const at = new Date(scheduledAt);
  const until = new Date(scheduledUntil);
  const DAY_IN_MILLIS: number = 86_400_000;
  const MAX_BOOKING_VALUE: number = 3;

  const room = await RoomModel.findOne<Room>({ _id: roomId });

  if (!room) {
    return res.status(404).json({ message: ErrorEnum.ROOM_NOT_FOUND });
  }

  const userBooking = await BookingModel.find({
    user_id: userId,
    state: "ONGOING",
  });
  if (userBooking && userBooking.length > MAX_BOOKING_VALUE) {
    return res.status(409).json({
      message: ErrorEnum.BOOKING_NOT_ALLOWED_MAX_BOOKING,
    });
  }
  const booking = await BookingModel.find({
    room: room._id,
    state: "ONGOING",
    $or: [
      {
        scheduledAt: { $gte: at, $lt: until },
      },
      {
        scheduledUntil: { $gt: at, $lte: until },
      },
      {
        $and: [
          { scheduledAt: { $lte: at } },
          { scheduledUntil: { $gte: until } },
        ],
      },
    ],
  });

  if (booking && booking.length > 0) {
    return res
      .status(409)
      .json({ message: ErrorEnum.BOOKING_NOT_ALLOWED_ROOM_ALREADY_BOOKED });
  }

  if (at.getTime() < new Date().getTime() - 300_000 || until < at) {
    return res.status(400).json({
      message: ErrorEnum.BOOKING_NOT_ALLOWED_PRIOR_DATE,
    });
  } else if (until.getTime() >= at.getTime() + DAY_IN_MILLIS) {
    return res.status(400).json({
      message: ErrorEnum.BOOKING_NOT_ALLOWED_TOO_LONG_PERIOD,
    });
  }

  const newBooking = await new BookingModel({
    room: room,
    user_id: userId,
    scheduledAt: at,
    scheduledUntil: until,
    state: "ONGOING",
  }).save();

  return res.status(200).json({
    message: "Booking successful",
    booking: newBooking,
  });
}

async function cancel(ids: string[], userId: string, res: Response) {
  const canceledBookings = await BookingModel.updateMany(
    { _id: { $in: ids }, user_id: userId },
    { state: "CLOSED", updatedAt: new Date() }
  );

  return canceledBookings;
}

export const BookingService = {
  book,
  cancel,
  get,
  findReservedBookings,
};
