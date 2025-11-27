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
// Get bookings
export async function getBookingsByMonth(year: number, month: number) {
  try {
    await connectDB();
    // Pad month to 2 digits
    const pad = (n: number) => n.toString().padStart(2, "0");
    const monthStr = pad(month); // JS months are 0-based

    // Construct start and end strings for string comparison
    const startDateStr = `${year}-${monthStr}-01`;
    const endDateStr = `${year}-${monthStr}-31`; // 31 works because strings sort lexically

    const bookings = await Booking.find({
      date: { $gte: startDateStr, $lte: endDateStr },
    })
      .sort({ date: 1, time: 1 })
      .lean();

    return {
      success: true,
      bookings: JSON.parse(JSON.stringify(bookings)),
    };
  } catch (error) {
    console.error("Error fetching bookings by month:", error);
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

// Get all bookings with filters (for admin)
export async function getAllBookingsAdmin(filters?: {
  status?: string;
  date?: string;
  email?: string;
}) {
  try {
    await connectDB();

    const query: any = {};

    if (filters?.status) {
      query.status = filters.status;
    }

    if (filters?.date) {
      query.date = filters.date;
    }

    if (filters?.email) {
      query.email = { $regex: filters.email, $options: "i" };
    }

    const bookings = await Booking.find(query)
      .sort({ date: -1, time: -1 })
      .lean();

    return {
      success: true,
      bookings: JSON.parse(JSON.stringify(bookings)),
    };
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return {
      success: false,
      error: "Échec de la récupération des réservations",
    };
  }
}

// Update booking status (already exists but here's the complete version)
export async function updateBookingStatus(
  bookingId: string,
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW"
) {
  try {
    await connectDB();

    if (!bookingId || !status) {
      return {
        success: false,
        error: "ID et statut requis",
      };
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      { new: true, runValidators: true }
    );

    if (!booking) {
      return {
        success: false,
        error: "Réservation non trouvée",
      };
    }

    return {
      success: true,
      booking: JSON.parse(JSON.stringify(booking)),
    };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return {
      success: false,
      error: "Échec de la mise à jour du statut",
    };
  }
}

// Get booking statistics
export async function getBookingStats() {
  try {
    await connectDB();

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "PENDING" });
    const confirmedBookings = await Booking.countDocuments({
      status: "CONFIRMED",
    });
    const completedBookings = await Booking.countDocuments({
      status: "COMPLETED",
    });
    const cancelledBookings = await Booking.countDocuments({
      status: "CANCELLED",
    });

    // Get today's bookings
    const today = new Date().toISOString().split("T")[0];
    const todayBookings = await Booking.countDocuments({
      date: today,
      status: { $in: ["PENDING", "CONFIRMED"] },
    });

    return {
      success: true,
      stats: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
        today: todayBookings,
      },
    };
  } catch (error) {
    console.error("Error fetching booking stats:", error);
    return {
      success: false,
      error: "Échec de la récupération des statistiques",
    };
  }
}
