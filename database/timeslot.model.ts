import { Schema, model, models, Document } from "mongoose";

export interface ITimeSlot extends Document {
  date: string; // NEW — e.g. "2025-01-21"
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  isAvailable: boolean;
  maxBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

const TimeSlotSchema = new Schema<ITimeSlot>(
  {
    date: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"],
    },
    startTime: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:MM)"],
    },
    endTime: {
      type: String,
      required: true,
      match: [/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:MM)"],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    maxBookings: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true }
);

// Unique: A date cannot have duplicate startTime
TimeSlotSchema.index({ date: 1, startTime: 1 }, { unique: true });

const TimeSlot =
  models.TimeSlot || model<ITimeSlot>("TimeSlot", TimeSlotSchema);

export default TimeSlot;
