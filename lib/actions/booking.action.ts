"use server";

import ClientBookingEmail from "@/components/emailTemplates/ClientBookingEmail";
import BookingDate from "@/database/booking-date.model";
import BookingTime from "@/database/booking-time.model";
import Booking from "@/database/booking.model";
import Package from "@/database/package.modal";
import connectDB from "@/lib/mongodb";
import { render } from "@react-email/render";
import mongoose from "mongoose";
import { sendEmail } from "../email";
import { OwnerBookingEmail } from "@/components/emailTemplates/OwnerBookingEmail";

interface TimeSlot {
  date: string;
  time: string;
}

interface CreateBookingParams {
  name: string;
  email: string;
  phone?: string;
  timeSlots: TimeSlot[];
  notes?: string;
  packageId?: string;
}

// Create booking
export async function createBooking(data: CreateBookingParams) {
  try {
    await connectDB();

    const { name, email, phone, timeSlots, notes, packageId } = data;

    if (!name || !email || !timeSlots || timeSlots.length === 0 || !packageId) {
      return {
        success: false,
        error: "Le nom, l'email, la date et l'heure sont requis",
      };
    }

    // Check if any of the time slots are already booked
    for (const slot of timeSlots) {
      const existingBookingDate = await BookingDate.findOne({
        date: slot.date,
      }).populate("times");

      if (existingBookingDate) {
        const existingTime = await BookingTime.findOne({
          _id: { $in: existingBookingDate.times },
          time: slot.time,
          status: { $in: ["PENDING", "CONFIRMED"] },
        });

        if (existingTime) {
          return {
            success: false,
            error: `Le créneau ${slot.date} à ${slot.time} est déjà réservé`,
          };
        }
      }
    }
    // Group time slots by date
    const dateGroups: { [key: string]: string[] } = {};
    timeSlots.forEach((slot) => {
      if (!dateGroups[slot.date]) {
        dateGroups[slot.date] = [];
      }
      dateGroups[slot.date].push(slot.time);
    });

    // Create BookingTime and BookingDate documents
    const dateIds = [];

    for (const [date, times] of Object.entries(dateGroups)) {
      // Create BookingTime documents for each time
      const timeIds = [];
      for (const time of times) {
        const bookingTime = await BookingTime.create({
          time,
          status: "PENDING",
        });
        timeIds.push(bookingTime._id);
      }

      // Check if BookingDate exists for this date
      let bookingDate = await BookingDate.findOne({ date });

      if (bookingDate) {
        // Add new times to existing date
        bookingDate.times.push(...timeIds);
        await bookingDate.save();
      } else {
        // Create new BookingDate
        bookingDate = await BookingDate.create({
          date,
          times: timeIds,
        });
      }

      dateIds.push(bookingDate._id);
    }
    const freePackage = await Package.findOne({ name: "free" });
    // Check if this email already has a "single" booking
    if (data.packageId == freePackage._id.toString()) {
      const existing = await Booking.findOne({
        email: data.email,
        package: freePackage._id,
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
      date: dateIds,
      notes: notes || undefined,
      package: new mongoose.Types.ObjectId(packageId),
      status: "PENDING",
    });

    await booking.populate([
      {
        path: "package",
      },
      {
        path: "date",
        populate: {
          path: "times",
        },
      },
    ]);

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
      .populate("package")
      .populate({
        path: "date",
        populate: {
          path: "times",
        },
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
    if (!year || !month) {
      return {
        success: false,
        error: "Année et mois requis",
      };
    }

    const monthStr = String(month).padStart(2, "0");
    const startDate = `${year}-${monthStr}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

    // Find all bookings for the month
    const bookings = await Booking.find({
      // Get bookings that were created in this month or have dates in this month
    })
      .populate({
        path: "date",
        model: "BookingDate",
        populate: {
          path: "times",
          model: "BookingTime",
          match: { status: { $in: ["PENDING", "CONFIRMED"] } },
        },
      })
      .populate({
        path: "package",
        model: "Package",
      });

    // Filter and flatten to get all date-time combinations for this month
    const monthBookings: any[] = [];

    for (const booking of bookings) {
      if (booking.date && Array.isArray(booking.date)) {
        for (const bookingDate of booking.date) {
          // Check if date falls within the month range
          if (bookingDate.date >= startDate && bookingDate.date <= endDate) {
            if (bookingDate.times && bookingDate.times.length > 0) {
              for (const bookingTime of bookingDate.times) {
                monthBookings.push({
                  _id: booking._id,
                  name: booking.name,
                  email: booking.email,
                  phone: booking.phone || null,
                  date: bookingDate.date,
                  time: bookingTime.time,
                  status: bookingTime.status,
                  bookingStatus: booking.status,
                  message: booking.message || null,
                  package: {
                    _id: booking.package._id,
                    name: booking.package.name,
                    price: booking.package.price,
                    sessions: booking.package.sessions || null,
                  },
                  createdAt: booking.createdAt,
                  updatedAt: booking.updatedAt,
                });
              }
            }
          }
        }
      }
    }

    return {
      success: true,
      bookings: JSON.parse(JSON.stringify(monthBookings)),
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
    const booking = await Booking.findById(bookingId).populate({
      path: "date",
      populate: {
        path: "times",
      },
    });

    if (!booking) {
      return { success: false, error: "Réservation non trouvée" };
    }
    // Update status of all associated times
    for (const date of booking.date as any[]) {
      if (date.times && date.times.length > 0) {
        for (const time of date.times) {
          await BookingTime.findByIdAndUpdate(time._id, {
            status: "CANCELLED",
          });
        }
      }
    }

    // Update main booking status
    booking.status = "CANCELLED";
    await booking.save();

    await booking.populate("package");
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

    const bookingDate = await BookingDate.findOne({ date }).populate({
      path: "times",
      match: { status: { $in: ["PENDING", "CONFIRMED"] } },
    });

    if (!bookingDate || !bookingDate.times) return [];

    return bookingDate.times.map((time: any) => time.time);
  } catch (error) {
    console.error("Error fetching booked slots:", error);
    return [];
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

    const booking = await Booking.findById(bookingId).populate({
      path: "date",
      populate: {
        path: "times",
      },
    });

    if (!booking) {
      return {
        success: false,
        error: "Réservation non trouvée",
      };
    }

    // Update status of all associated times
    for (const date of booking.date as any[]) {
      if (date.times && date.times.length > 0) {
        for (const time of date.times) {
          await BookingTime.findByIdAndUpdate(time._id, { status });
        }
      }
    }

    // Update main booking status
    booking.status = status;
    await booking.save();

    await booking.populate("package");

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
export async function sendBookingConfirmationEmail({
  name,
  email,
  slotsText,
  packageName,
  price,
}: {
  name: string;
  email: string;
  slotsText: string;
  packageName: string;
  price: number;
}) {
  try {
    const emailHtml = await render(
      ClientBookingEmail({
        name,
        slotsText,
        packageName,
        price,
      })
    );

    await sendEmail({
      to: email,
      subject: "Confirmation de votre réservation",
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
export async function sendOwnerBookingNotificationEmail({
  clientName,
  clientEmail,
  slotsText,
  packageName,
  price,
}: {
  clientName: string;
  clientEmail: string;
  slotsText: string;
  packageName: string;
  price: number;
}) {
  try {
    const emailHtml = await render(
      OwnerBookingEmail({
        clientName,
        clientEmail,
        slotsText,
        packageName,
        price,
      })
    );

    await sendEmail({
      to: process.env.NEXT_PUBLIC_EMAIL_USER!,
      subject: "📢 Nouvelle réservation",
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending owner email:", error);
    return { success: false, error: "Failed to send email" };
  }
}
