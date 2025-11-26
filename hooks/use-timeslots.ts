"use client";

import { useState, useEffect } from "react";
import { getTimeSlotsByDate } from "../lib/actions/timeslot.action";

interface TimeSlot {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxBookings: number;
}

export const useTimeSlots = (selectedDate: string | null) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchTimeSlots = async (dateString: string) => {
    try {
      setLoading(true);
      setError(null);
      //const date = new Date(dateString);

      const result = await getTimeSlotsByDate(dateString);

      if (result.success && result.timeSlots) {
        setTimeSlots(result.timeSlots);
      } else {
        setError(result.error || "Erreur lors du chargement des créneaux");
        setTimeSlots([]);
      }
    } catch (err) {
      console.error("Error fetching time slots:", err);
      setError("Une erreur est survenue");
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Extract just the start times for display
  const availableTimes = timeSlots.map((slot) => slot.startTime);

  return {
    timeSlots,
    availableTimes,
    loading,
    error,
  };
};
