import { RoomMapper } from "../mapper/room/room.mapper";
import { Booking } from "../model/booking.model";
import { Room, RoomModel } from "../model/room.model";
import { BookingService } from "./booking.service";

interface SearchOptions {
  id?: string;
  capacity?: number;
  equipments?: string;
  hasAll?: boolean;
  scheduledAt?: Date;
  scheduledUntil?: Date;
}

async function getRooms(options: SearchOptions) {
  const {
    id,
    capacity,
    equipments,
    scheduledAt,
    scheduledUntil,
    hasAll = false,
  } = options;
  const equipmentsArray: string[] | undefined = equipments?.split(",");

  const query: any = {
    ...(id && { _id: id }),
    ...(capacity && { $gte: capacity }),
    ...(equipmentsArray &&
      equipmentsArray.length > 0 &&
      (hasAll ? { $all: equipmentsArray } : { $in: equipmentsArray })),
  };
  if (scheduledAt && scheduledUntil) {
    await BookingService.findReservedBookings({
      scheduledAt: scheduledAt,
      scheduledUntil: scheduledUntil,
    }).then((res) => {
      const bookings: Booking[] = res;
      query._id = { $nin: bookings.map((booking) => booking.room) };
    });
  }

  const rooms = await RoomModel.find(query); 
  return RoomMapper.toDTOs(rooms);
}

export const RoomService = {
  getRooms,
};
