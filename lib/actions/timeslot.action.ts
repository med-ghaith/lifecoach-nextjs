"use server";

import TimeSlot from "@/database/timeslot.model";
import connectDB from "@/lib/mongodb";

// Get time slots for a specific day
export async function getTimeSlotsByDate(date: string) {
  try {
    await connectDB();

    const slots = await TimeSlot.find({ date }).sort({ startTime: 1 });

    return {
      success: true,
      timeSlots: JSON.parse(JSON.stringify(slots)),
    };
  } catch (error) {
    console.error("Error fetching time slots:", error);
    return {
      success: false,
      error: "Échec de la récupération des créneaux",
    };
  }
}

// Get all time slots
export async function getAllTimeSlots() {
  try {
    await connectDB();

    const timeSlots = await TimeSlot.find({})
      .sort({ date: 1, startTime: 1 })
      .lean();

    return {
      success: true,
      timeSlots: JSON.parse(JSON.stringify(timeSlots)),
    };
  } catch (error) {
    console.error("Error fetching all time slots:", error);
    return {
      success: false,
      error: "Échec de la récupération des créneaux",
    };
  }
}

// Create time slot (for admin)
export async function createTimeSlot(data: {
  date: string;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
  maxBookings?: number;
}) {
  try {
    await connectDB();

    const timeSlot = await TimeSlot.create(data);

    return {
      success: true,
      timeSlot: JSON.parse(JSON.stringify(timeSlot)),
    };
  } catch (error: any) {
    console.error("Error creating time slot:", error);

    if (error.code === 11000) {
      return {
        success: false,
        error: "Ce créneau existe déjà",
      };
    }

    return {
      success: false,
      error: "Échec de la création du créneau",
    };
  }
}

// Update time slot
export async function updateTimeSlot(
  id: string,
  data: {
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
    maxBookings?: number;
  }
) {
  try {
    await connectDB();

    const timeSlot = await TimeSlot.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!timeSlot) {
      return {
        success: false,
        error: "Créneau non trouvé",
      };
    }

    return {
      success: true,
      timeSlot: JSON.parse(JSON.stringify(timeSlot)),
    };
  } catch (error) {
    console.error("Error updating time slot:", error);
    return {
      success: false,
      error: "Échec de la mise à jour du créneau",
    };
  }
}

// Delete time slot
export async function deleteTimeSlot(id: string) {
  try {
    await connectDB();

    const timeSlot = await TimeSlot.findByIdAndDelete(id);

    if (!timeSlot) {
      return {
        success: false,
        error: "Créneau non trouvé",
      };
    }

    return {
      success: true,
      message: "Créneau supprimé",
    };
  } catch (error) {
    console.error("Error deleting time slot:", error);
    return {
      success: false,
      error: "Échec de la suppression du créneau",
    };
  }
}

// Seed default time slots (run once to populate database)
export async function seedTimeSlots() {
  try {
    await connectDB();

    const defaultSlots = [
      // Lundi
      { dayOfWeek: 1, startTime: "09:00", endTime: "09:40" },
      { dayOfWeek: 1, startTime: "10:30", endTime: "11:10" },
      { dayOfWeek: 1, startTime: "14:00", endTime: "14:40" },
      { dayOfWeek: 1, startTime: "15:30", endTime: "16:10" },

      // Mardi
      { dayOfWeek: 2, startTime: "09:00", endTime: "09:40" },
      { dayOfWeek: 2, startTime: "10:30", endTime: "11:10" },
      { dayOfWeek: 2, startTime: "14:00", endTime: "14:40" },

      // Mercredi
      { dayOfWeek: 3, startTime: "09:00", endTime: "09:40" },
      { dayOfWeek: 3, startTime: "14:00", endTime: "14:40" },
      { dayOfWeek: 3, startTime: "15:30", endTime: "16:10" },
      { dayOfWeek: 3, startTime: "17:00", endTime: "17:40" },

      // Jeudi
      { dayOfWeek: 4, startTime: "09:00", endTime: "09:40" },
      { dayOfWeek: 4, startTime: "10:30", endTime: "11:10" },
      { dayOfWeek: 4, startTime: "14:00", endTime: "14:40" },

      // Vendredi
      { dayOfWeek: 5, startTime: "09:00", endTime: "09:40" },
      { dayOfWeek: 5, startTime: "10:30", endTime: "11:10" },
      { dayOfWeek: 5, startTime: "12:00", endTime: "12:40" },
    ];

    for (const slot of defaultSlots) {
      await TimeSlot.findOneAndUpdate(
        { dayOfWeek: slot.dayOfWeek, startTime: slot.startTime },
        slot,
        { upsert: true }
      );
    }

    return {
      success: true,
      message: "Créneaux créés avec succès",
    };
  } catch (error) {
    console.error("Error seeding time slots:", error);
    return {
      success: false,
      error: "Échec de la création des créneaux",
    };
  }
}
