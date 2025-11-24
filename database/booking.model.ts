import { Schema, model, models, Document } from "mongoose";

export interface IBooking extends Document {
  name: string;
  email: string;
  phone?: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  message?: string;
  package?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    name: {
      type: String,
      required: [true, "Le nom est requis"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "L'email est requis"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email invalide"],
    },
    phone: {
      type: String,
      trim: true,
    },
    date: {
      type: String,
      required: [true, "La date est requise"],
      match: [/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"],
    },
    time: {
      type: String,
      required: [true, "L'heure est requise"],
      match: [/^\d{2}:\d{2}$/, "Format d'heure invalide (HH:MM)"],
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"],
      default: "PENDING",
    },
    message: {
      type: String,
      trim: true,
    },
    package: {
      type: String,
      enum: ["single", "pack3", "pack5", "pack10", "unlimited", "premium"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for unique booking constraint
BookingSchema.index({ email: 1, date: 1, time: 1 }, { unique: true });

// Create indexes for faster queries
BookingSchema.index({ date: 1, time: 1 });
BookingSchema.index({ email: 1 });
BookingSchema.index({ status: 1 });

// Virtual for full date/time
BookingSchema.virtual("dateTime").get(function () {
  return `${this.date} ${this.time}`;
});

// Method to check if booking is in the past
BookingSchema.methods.isPast = function () {
  const bookingDate = new Date(`${this.date}T${this.time}`);
  return bookingDate < new Date();
};

// Static method to find available slots
BookingSchema.statics.findAvailableSlots = async function (date: string) {
  const bookedSlots = await this.find({
    date,
    status: { $in: ["PENDING", "CONFIRMED"] },
  }).select("time");

  return bookedSlots.map((booking: any) => booking.time);
};

const Booking = models.Booking || model<IBooking>("Booking", BookingSchema);

export default Booking;
