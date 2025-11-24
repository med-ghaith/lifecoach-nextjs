"use client";

import { useState, useEffect } from "react";
import {
  createBooking,
  getBookingsByEmail,
  cancelBooking as cancelBookingAction,
  getBookedSlots,
  getBookingsByMonth,
} from "@/lib/actions/booking.action";
import { TIME_SLOTS } from "@/app/booking/page";
import { sendEmail } from "@/lib/email";

export interface Booking {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  status?: string;
  notes?: string;
  package?: string;
}

export const useBookings = (userEmail?: string) => {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchAllBookings(currentYear, currentMonth+1); // only call if selectedDate is not null
  }, [currentMonth, currentYear]);
  const fetchAllBookings = async (year: number, month: number) => {
    try {
      const result = await getBookingsByMonth(year, month); // implement this API call
      if (result.success && result.bookings) {
        setAllBookings(result.bookings);
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    if (userEmail) {
      fetchBookings();
    }
  }, [userEmail]);

  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlotsForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchBookings = async () => {
    if (!userEmail) return;
    try {
      setLoading(true);
      const result = await getBookingsByEmail(userEmail);
      if (result.success && result.bookings) {
        setBookings(result.bookings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedSlotsForDate = async (date: string) => {
    try {
      const slots = await getBookedSlots(date);
      setBookedSlots(slots);
    } catch (err) {
      console.error(err);
    }
  };

  const isDateBooked = (isoDate: string, time: string): boolean => {
    return bookedSlots.includes(time);
  };
  const isDayFullyBooked = (date: string) => {
    const bookingsForDay = allBookings.filter((b) => b.date === date);

    return TIME_SLOTS.every((slot) =>
      bookingsForDay.some((b) => b.time === slot)
    );
  };

  const handleBooking = async (bookingData: {
    name: string;
    email: string;
    phone?: string;
  }) => {
    if (!selectedDate || !selectedTime) {
      setError("Veuillez sélectionner une date et une heure");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await createBooking({
        ...bookingData,
        package: "single",
        date: selectedDate,
        time: selectedTime,
      });

      if (!result.success) {
        setError(result.error || "Erreur");
        return false;
      }

      if (bookingData.email === userEmail && result.booking) {
        setBookings((prev) => [...prev, result.booking]);
      }

      setBookedSlots((prev) => [...prev, selectedTime]);
      setShowConfirmation(true);

      setTimeout(() => {
        setShowConfirmation(false);
        setSelectedDate(null);
        setSelectedTime(null);
      }, 3000);
      await sendEmail({
        to: bookingData.email,
        subject: "Séance gratuite",
        html: `<h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${bookingData.email}</p>,
    <p><strong>date:</strong> ${selectedDate}</p>,
    <p><strong>time:</strong> ${selectedTime}</p>`,
      });
      return true;
    } catch (err) {
      setError("Une erreur est survenue");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    if (!bookingId) return false;

    setLoading(true);

    try {
      const result = await cancelBookingAction(bookingId);

      if (!result.success) {
        setError(result.error || "Erreur");
        return false;
      }

      setBookings((prev) => prev.filter((b) => b._id !== bookingId));

      if (selectedDate) {
        fetchBookedSlotsForDate(selectedDate);
      }

      return true;
    } catch (err) {
      setError("Erreur");
      return false;
    } finally {
      setLoading(false);
    }
  };
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  return {
    bookings,
    selectedDate,
    selectedTime,
    showConfirmation,
    loading,
    error,
    currentMonth,
    currentYear,
    goToPreviousMonth,
    goToNextMonth,
    setSelectedDate,
    setSelectedTime,
    setError,
    isDateBooked,
    handleBooking,
    cancelBooking,
    fetchBookings,
    isDayFullyBooked,
  };
};
