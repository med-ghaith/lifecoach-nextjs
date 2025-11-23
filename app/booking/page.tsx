"use client";

import { useMemo } from "react";
import Calendar from "@/components/booking/calendar";
import TimeSlots from "@/components/booking/time-slots";
import BookingInfo from "@/components/booking/booking-info";
import BookingsList from "@/components/booking/bookings-list";
import { useBookings } from "@/hooks/use-bookings";
import { getCalendarData } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

const TIME_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export default function BookingPage() {
  const {
    bookings,
    selectedDate,
    selectedTime,
    showConfirmation,
    setSelectedDate,
    setSelectedTime,
    isDateBooked,
    handleBooking,
    cancelBooking,
  } = useBookings();

  const calendarData = useMemo(() => getCalendarData(), []);

  return (
    <div className="pt-22 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Réserver une Séance
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
            />

            <TimeSlots
              timeSlots={TIME_SLOTS}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              isDateBooked={isDateBooked}
            />

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  selectedDate && selectedTime
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                Réserver
              </button>
              {showConfirmation && (
                <div className="inline-flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  <span>Réservé !</span>
                </div>
              )}
            </div>
          </div>

          <BookingsList bookings={bookings} onCancel={cancelBooking} />
        </div>

        <BookingInfo />
      </div>
    </div>
  );
}
