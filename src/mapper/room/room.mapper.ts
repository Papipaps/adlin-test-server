import { Equipment, Room, RoomDTO } from "../../model/room.model";

function toDTO(room: Room): RoomDTO {
  return {
    id: room._id,
    name: room.name,
    description: room.description,
    capacity: room.capacity,
    equipements: room.equipements,
  };
}
function toDTOs(rooms: Room[]): RoomDTO[] {
  return rooms.map((room) => toDTO(room));
}

export const RoomMapper = {
  toDTO,toDTOs
};
