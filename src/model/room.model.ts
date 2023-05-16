import mongoose, { Schema, Document } from "mongoose";

export interface Equipment {
  name: string;
}

export interface Room extends Document {
  _id: string;
  name: string;
  description: string;
  capacity: number;
  equipements: Equipment[];
  createdAt: Date;
  updatedAt: Date | null;
}

export interface RoomDTO {
  id: string;
  name: string;
  description: string;
  capacity: number;
  equipements: Equipment[];
}

const RoomSchema = new Schema<Room>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  capacity: { type: Number, required: true },
  equipements: [{ name: { type: String } }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: null },
});

export const RoomModel = mongoose.model<Room>("Room", RoomSchema);
