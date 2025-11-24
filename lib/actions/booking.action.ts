"use server";

import Booking from "@/database/booking.model";
import connectDB from "@/lib/mongodb";

interface CreateBookingParams {
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  notes?: string;
  package?: string;
}

// Create booking
export async function createBooking(data: CreateBookingParams) {
  try {
    await connectDB();

    const {
      name,
      email,
      phone,
      date,
      time,
      notes,
      package: packageType,
    } = data;

    if (!name || !email || !date || !time) {
      return {
        success: false,
        error: "Le nom, l'email, la date et l'heure sont requis",
      };
    }

    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      date,
      time,
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    if (existingBooking) {
      return {
        success: false,
        error: "Ce créneau est déjà réservé",
      };
    }

    // Check if this email already has a "single" booking
    if (data.package === "single") {
      const existing = await Booking.findOne({
        email: data.email,
        package: "single",
      });
      if (existing) {
        return {
          success: false,
          error: "Vous avez déjà une réservation avec le package 'Gratuite'.",
        };
      }
    }

    // Create booking
    const booking = await Booking.create({
      name,
      email,
      phone: phone || undefined,
      date,
      time,
      notes: notes || undefined,
      package: packageType || undefined,
      status: "PENDING",
    });

    return {
      success: true,
      booking: JSON.parse(JSON.stringify(booking)),
    };
  } catch (error: any) {
    console.error("Error creating booking:", error);

    if (error.code === 11000) {
      return {
        success: false,
        error: "Ce créneau est déjà réservé avec cet email",
      };
    }

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return {
        success: false,
        error: messages.join(", "),
      };
    }

    return {
      success: false,
      error: "Échec de la création de la réservation",
    };
  }
}

// Get bookings by email
export async function getBookingsByEmail(email: string) {
  try {
    await connectDB();

    if (!email) {
      return { success: false, error: "Email requis" };
    }

    const bookings = await Booking.find({
      email,
      status: { $in: ["PENDING", "CONFIRMED"] },
    })
      .sort({ date: 1, time: 1 })
      .lean();

    return {
      success: true,
      bookings: JSON.parse(JSON.stringify(bookings)),
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      error: "Échec de la récupération des réservations",
    };
  }
}

// Cancel booking
export async function cancelBooking(bookingId: string) {
  try {
    await connectDB();

    if (!bookingId) {
      return { success: false, error: "ID de réservation requis" };
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: "CANCELLED" },
      { new: true }
    );

    if (!booking) {
      return { success: false, error: "Réservation non trouvée" };
    }

    return {
      success: true,
      booking: JSON.parse(JSON.stringify(booking)),
    };
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      error: "Échec de l'annulation de la réservation",
    };
  }
}

// Get booked slots for a date
export async function getBookedSlots(date: string) {
  try {
    await connectDB();

    if (!date) return [];

    const bookings = await Booking.find({
      date,
      status: { $in: ["PENDING", "CONFIRMED"] },
    }).select("time");

    return bookings.map((booking) => booking.time);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return [];
  }
}
