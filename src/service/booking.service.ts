import { Booking, BookingModel } from "../model/booking.model";
import { Response } from "express";
import { Room, RoomModel } from "../model/room.model";
import { BookMapper } from "../mapper/booking/booking.mapper";
import { SearchBookingParams } from "../controller/booking";

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

  const query: any = {
    ...(id && { _id: id }),
    ...(roomId && { room: roomId }),
    ...(userId && { user_id: userId }),
    ...(state && { state: state }),
    ...(at && until && at < until && { scheduledAt: { $gte: scheduledAt } }),
    ...(until &&
      until > now.getTime() && { scheduledUntil: { $lte: scheduledUntil } }),
  };
  const bookings: Booking[] = await BookingModel.find(query).populate("room");
  // return bookings
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
    return res.status(404).json({ message: "Room not found" });
  }

  const userBooking = await BookingModel.find({
    user_id: userId,
    state: "ONGOING",
  });
  if (userBooking && userBooking.length > MAX_BOOKING_VALUE) {
    return res.status(409).json({
      message: `Cannot book more than ${MAX_BOOKING_VALUE} rooms at a time`,
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
      .json({ message: "this room is already booked at this time" });
  }

  if (at.getTime() < new Date().getTime() - 300_000 || until < at) {
    return res.status(400).json({
      message: `A room cannot be booked prior to this date`,
    });
  } else if (until.getTime() >= at.getTime() + DAY_IN_MILLIS) {
    return res.status(400).json({
      message: `You can't book for more than a day`,
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
  // const room = await RoomModel.findOne<Room>({ id: roomId });
  // if (!room) {
  //   return res.status(404).json({ message: "Room not found" });
  // }

  // const deletedBooking = await BookingModel.up({
  //   _id: { $in: ids },
  //   user_id: userId,
  // });
  // if (!deletedBooking || deletedBooking.length==0) {
  //   return res
  //     .status(404)
  //     .json({ message: "No booking found for this room" });
  // }

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
