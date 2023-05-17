import AppException from "../errors/AppException";
import { ENTITY_NOT_FOUND, ErrorEnum } from "../errors/custom.errors";
import { RoomMapper } from "../mapper/room/room.mapper";
import { Booking } from "../model/booking.model";
import { Room, RoomModel } from "../model/room.model";
import { BookingService } from "./booking.service";

export interface SearchOptions {
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

  const queryEquipments = hasAll
    ? { ["equipements.name"]: { $all: equipmentsArray } }
    : { ["equipements.name"]: { $in: equipmentsArray } };

  const query: any = {
    ...(id && { _id: id }),
    ...(capacity && { capacity: { $gte: capacity } }),
    ...(equipmentsArray && equipmentsArray.length > 0 && queryEquipments),
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
