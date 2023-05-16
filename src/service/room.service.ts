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

  const query: any = {};
  let bookings: Booking[] = [];
  if (id) {
    query._id = { _id: id };
  }

  if (capacity && capacity > 0) {
    query.capacity = { $gte: capacity };
  }

  const equipmentsArray: string[] | undefined = equipments?.split(",");

  if (equipmentsArray && equipmentsArray.length > 0) {
    query["equipements.name"] = {
      ...(hasAll ? { $all: equipmentsArray } : { $in: equipmentsArray }),
    };
  }
    await BookingService.findReservedBookings({
      scheduledAt: scheduledAt,
      scheduledUntil: scheduledUntil,
    }).then((res) => {
      bookings = res;
      query._id = { $nin: bookings.map((booking) => booking.room) };
    });

  const rooms = await RoomModel.find(query);
  return RoomMapper.toDTOs(rooms);
}

export const RoomService = {
  getRooms,
};
