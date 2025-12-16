"use client";

import { useState, useEffect } from "react";
import {
  createBooking,
  getBookingsByEmail,
  cancelBooking as cancelBookingAction,
  getBookedSlots,
  getBookingsByMonth,
  sendBookingConfirmationEmail,
  sendOwnerBookingNotificationEmail,
} from "@/lib/actions/booking.action";
import { useBooking } from "@/context/BookingContext";

export interface TimeSlot {
  date: string;
  time: string;
}

export interface Booking {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  date: Array<{
    _id: string;
    date: string;
    times: Array<{
      _id: string;
      time: string;
      status: string;
    }>;
  }>;
  status: string;
  message?: string;
  package: {
    _id: string;
    name: string;
    price: number;
    sessions?: number;
    features?: string[];
  };
}

interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export const useBookings = (
  userEmail?: string,
  availableTimeSlots?: string[]
) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Multiple time slots selection
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const { selectedPackage, setSelectedPackage, maxSessions, setMaxSessions } =
    useBooking();

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [allBookings, setAllBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchAllBookings(currentYear, currentMonth + 1);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    if (userEmail) {
      fetchBookings();
    }
  }, [userEmail]);

  const fetchAllBookings = async (year: number, month: number) => {
    try {
      setLoading(true);
      const result = await getBookingsByMonth(year, month);
      if (result.success && result.bookings) {
        setAllBookings(result.bookings);
      }
    } catch (err) {
      console.error("Error fetching all bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    if (!userEmail) return;

    try {
      setLoading(true);
      const result = await getBookingsByEmail(userEmail);
      if (result.success && result.bookings) {
        setBookings(result.bookings);
      } else {
        setError(result.error || "Erreur lors du chargement des réservations");
      }
    } catch (err) {
      console.error("Error fetching user bookings:", err);
      setError("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlotsForDate = async (date: string) => {
    try {
      const slots = await getBookedSlots(date);
      setBookedSlots(slots);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    }
  };

  const isDateBooked = (date: string, time: string): boolean => {
    return allBookings.some(
      (booking) =>
        booking.date === date &&
        booking.time === time &&
        (booking.status === "PENDING" || booking.status === "CONFIRMED")
    );
  };

  const isDayFullyBooked = (date: string): boolean => {
    if (!availableTimeSlots || availableTimeSlots.length === 0) {
      return false;
    }

    const bookingsForDay = allBookings.filter(
      (b) =>
        b.date === date && (b.status === "PENDING" || b.status === "CONFIRMED")
    );

    return availableTimeSlots.every((slot) =>
      bookingsForDay.some((b) => b.time === slot)
    );
  };

  // Add or remove a time slot from selection
  const toggleTimeSlot = (date: string, time: string) => {
    const slotIndex = selectedTimeSlots.findIndex(
      (slot) => slot.date === date && slot.time === time
    );

    if (slotIndex > -1) {
      // Remove slot
      setSelectedTimeSlots((prev) =>
        prev.filter((_, index) => index !== slotIndex)
      );
    } else {
      // Add slot (if under limit)

      if (selectedTimeSlots.length < maxSessions) {
        setSelectedTimeSlots((prev) => [...prev, { date, time }]);
      } else {
        setError(`Vous pouvez sélectionner jusqu'à ${maxSessions} créneaux`);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  // Check if a time slot is selected
  const isTimeSlotSelected = (date: string, time: string): boolean => {
    return selectedTimeSlots.some(
      (slot) => slot.date === date && slot.time === time
    );
  };

  // Clear all selected time slots
  const clearTimeSlots = () => {
    setSelectedTimeSlots([]);
  };

  const handleBooking = async (bookingData: BookingFormData) => {
    if (selectedTimeSlots.length === 0) {
      setError("Veuillez sélectionner au moins un créneau horaire");
      return false;
    }

    if (!selectedPackage) {
      setError("Veuillez sélectionner un forfait");
      return false;
    }

    // Check if any selected slot is already booked
    for (const slot of selectedTimeSlots) {
      if (isDateBooked(slot.date, slot.time)) {
        setError(`Le créneau ${slot.date} à ${slot.time} est déjà réservé`);
        return false;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createBooking({
        ...bookingData,
        timeSlots: selectedTimeSlots,
        packageId: selectedPackage,
      });

      if (!result.success) {
        setError(result.error || "Échec de la création de la réservation");
        return false;
      }

      if (bookingData.email === userEmail && result.booking) {
        setBookings((prev) => [...prev, result.booking]);
      }

      // Update booked slots for all selected dates
      const uniqueDates = [...new Set(selectedTimeSlots.map((s) => s.date))];
      for (const date of uniqueDates) {
        await fetchBookedSlotsForDate(date);
      }

      if (result.booking) {
        // Update allBookings with new slots
        const newSlots = selectedTimeSlots.map((slot) => ({
          date: slot.date,
          time: slot.time,
          status: "PENDING",
        }));
        setAllBookings((prev) => [...prev, ...newSlots]);
      }

      setShowConfirmation(true);

      // Send confirmation email
      try {
        const slotsText = selectedTimeSlots
          .map((slot) => `${slot.date} à ${slot.time}`)
          .join("<br/>");
        let finalPrice = result.booking.package.price;
        if (result.booking.package.discount) {
          finalPrice =
            (result.booking.package.price * result.booking.package.discount) /
            100;
        }
        await sendBookingConfirmationEmail({
          name: bookingData.name,
          email: bookingData.email,
          slotsText,
          packageName: result.booking.package.name,
          price: finalPrice,
        });
        // Send notification email to owner
        await sendOwnerBookingNotificationEmail({
          clientName: bookingData.name,
          clientEmail: bookingData.email,
          slotsText,
          packageName: result.booking.package.name,
          price: finalPrice,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }

      setTimeout(() => {
        setShowConfirmation(false);
        clearTimeSlots();
        setSelectedPackage(null);
      }, 3000);

      return true;
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Une erreur est survenue lors de la réservation");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!bookingId) return false;

    setLoading(true);
    setError(null);

    try {
      const result = await cancelBookingAction(bookingId);

      if (!result.success) {
        setError(result.error || "Échec de l'annulation");
        return false;
      }

      setBookings((prev) => prev.filter((b) => b._id !== bookingId));

      // Refresh month bookings
      await fetchAllBookings(currentYear, currentMonth + 1);

      return true;
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError("Une erreur est survenue lors de l'annulation");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const adjustDateToNewMonth = (newMonth: number, newYear: number) => {
    // Clear time slots when changing months
    clearTimeSlots();
  };

  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      const newYear = currentYear - 1;
      setCurrentMonth(11);
      setCurrentYear(newYear);
      // adjustDateToNewMonth(11, newYear);
      if (selectedDate) {
        const [year, month, day] = selectedDate.split("-");
        const newDate = `${currentYear - 1}-12-${day}`;
        setSelectedDate(newDate);
      }
    } else {
      const newMonth = currentMonth - 1;
      setCurrentMonth(newMonth);
      // adjustDateToNewMonth(newMonth, currentYear);
      if (selectedDate) {
        const [year, month, day] = selectedDate.split("-");
        const newMonth = String(currentMonth).padStart(2, "0");
        const newDate = `${year}-${newMonth}-${day}`;
        setSelectedDate(newDate);
      }
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      const newYear = currentYear + 1;
      setCurrentMonth(0);
      setCurrentYear(newYear);
      // adjustDateToNewMonth(0, newYear);
      if (selectedDate) {
        const [year, month, day] = selectedDate.split("-");
        const newDate = `${currentYear + 1}-01-${day}`;
        console.log(newDate);
        setSelectedDate(newDate);
      }
    } else {
      const newMonth = currentMonth + 1;
      setCurrentMonth(newMonth);
      //adjustDateToNewMonth(newMonth, currentYear);
      if (selectedDate) {
        const [year, month, day] = selectedDate.split("-");
        const newMonth = String(currentMonth + 2).padStart(2, "0");
        const newDate = `${year}-${newMonth}-${day}`;
        console.log(newMonth);
        setSelectedDate(newDate);
      }
    }
  };

  return {
    bookings,
    allBookings,
    selectedTimeSlots,
    selectedPackage,
    maxSessions,
    showConfirmation,
    loading,
    error,
    currentMonth,
    currentYear,
    bookedSlots,
    selectedDate,
    setSelectedPackage,
    setSelectedDate,
    setMaxSessions,
    setAllBookings,
    setError,
    toggleTimeSlot,
    isTimeSlotSelected,
    clearTimeSlots,
    isDateBooked,
    isDayFullyBooked,
    handleBooking,
    cancelBooking,
    fetchBookings,
    fetchAllBookings,
    goToPreviousMonth,
    goToNextMonth,
  };
};
