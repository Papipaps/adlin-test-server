import { Booking, BookingModel, STATE } from "../../model/booking.model";
import { RoomDTO } from "../../model/room.model";

interface BookingDTO {
  id: string;
  room: {
    _id: string;
    name: string;
    capacity:number;
  };
  createdAt: Date;
  updatedAt: Date;
  state: STATE;
  scheduledAt: Date;
  scheduledUntil: Date;
}

function toDTO(booking: Booking):BookingDTO {
  return {
    id: booking._id,
    room:{
      _id:booking.room._id,
      name:booking.room.name,
      capacity:booking.room.capacity,
    },
    createdAt: booking.createdAt,
    state: booking.state,
    updatedAt: booking.updatedAt,
    scheduledAt: booking.scheduledAt,
    scheduledUntil: booking.scheduledUntil,
  };
}

function toDTOs(bookings:Booking[]) {
  console.log("mapping..",bookings)
  return bookings.map(booking=>toDTO(booking))
}
export const BookMapper = {
  toDTO,toDTOs
};
