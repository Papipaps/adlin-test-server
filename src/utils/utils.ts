import fs from "fs";
import { Booking } from "../model/booking.model";

export function readJSONFromFile(filePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
} 

export const writeBookingToFile = (booking: Booking): void => {
  let bookings: Booking[] = [];
 
  if (fs.existsSync('src/assets/reservations.json')) {
    const fileData = fs.readFileSync('src/assets/reservations.json', 'utf-8');
    bookings = JSON.parse(fileData);
  }
  bookings.push(booking);
 
  fs.writeFileSync("src/assets/reservations.json", JSON.stringify(bookings, null, 2));
};