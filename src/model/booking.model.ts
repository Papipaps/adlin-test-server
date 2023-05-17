import mongoose, { Schema, Document } from "mongoose";
import { Room } from "./room.model";
 
export interface Booking extends Document {
  _id: string;
  user_id: string;
  room: Room;
  createdAt: Date;
  updatedAt: Date;
  scheduledAt: Date;
  scheduledUntil: Date;
  state: STATE;
}

export type STATE = "ONGOING" | "CLOSED";

const BookingSchema = new Schema<Booking>({
  user_id: { type: String, required: true },
  room: {
    type: Schema.Types.ObjectId,
    ref: "Room",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  scheduledAt: { type: Date, required: true },
  scheduledUntil: { type: Date, required: true },
  state: { type: String, required: true },
});

export const BookingModel = mongoose.model<Booking>("Booking", BookingSchema);
