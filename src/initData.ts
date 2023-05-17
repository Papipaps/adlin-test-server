import { readJSONFromFile } from "./utils/utils";
import {Room,RoomModel} from "./model/room.model";

export function populateData() {
  readJSONFromFile("src/assets/salles.json")
    .then(async (jsonData) => {
      const rooms: Room[] = jsonData.rooms;
      const filteredRooms = await Promise.all(
        rooms.map(async (room) => {
          const exists = await RoomModel.exists({ name: room.name }).exec();
          return !exists;
        })
      );
      const roomsToInsert = rooms.filter(
        (_room, index) => filteredRooms[index]
      );
      RoomModel.insertMany(roomsToInsert)
        .then((insertedData) => {
          const message =
            roomsToInsert.length > 0
              ? `Data inserted successfully: ${insertedData}`
              : `Rooms are ready. `;
          console.log(message);
        })
        .catch((insertErr) => {
          console.error("Error inserting data into the database:", insertErr);
        });
    })
    .catch((readErr) => {
      console.error("Error reading data file:", readErr);
    });
}
