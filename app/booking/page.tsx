"use client";

import { useMemo, useState } from "react";
import Calendar from "@/components/booking/calendar";
import TimeSlots from "@/components/booking/time-slots";
import BookingInfo from "@/components/booking/booking-info";
import BookingsList from "@/components/booking/bookings-list";
import BookingModal from "@/components/booking/booking-modal";
import { useBookings } from "@/hooks/use-bookings";
import { getCalendarData } from "@/lib/utils";
import { CheckCircle, AlertCircle } from "lucide-react";

const TIME_SLOTS = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export default function BookingPage() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [showModal, setShowModal] = useState(false);

  const {
    bookings,
    selectedDate,
    selectedTime,
    showConfirmation,
    loading,
    error,
    setSelectedDate,
    setSelectedTime,
    setError,
    isDateBooked,
    handleBooking,
    cancelBooking,
  } = useBookings(userEmail);

  const calendarData = useMemo(() => getCalendarData(), []);

  const handleReserverClick = () => {
    if (!selectedDate || !selectedTime) {
      setError("Veuillez sélectionner une date et une heure");
      return;
    }
    setShowModal(true);
  };

  const handleModalSubmit = async (data: {
    name: string;
    email: string;
    phone?: string;
  }) => {
    setUserEmail(data.email);
    const success = await handleBooking(data);
    if (success) {
      setShowModal(false);
    }
    return success;
  };

  return (
    <div className="pt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Réserver une Séance
      </h2>

      {error && !showModal && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            ✕
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <Calendar
              calendarData={calendarData}
              selectedDate={selectedDate}
              onSelectDate={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
                setError(null);
              }}
            />

            <TimeSlots
              timeSlots={TIME_SLOTS}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelectTime={(time) => {
                setSelectedTime(time);
                setError(null);
              }}
              isDateBooked={isDateBooked}
            />

            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleReserverClick}
                disabled={!selectedDate || !selectedTime || loading}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  selectedDate && selectedTime && !loading
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? "Chargement..." : "Réserver"}
              </button>
              {showConfirmation && (
                <div className="inline-flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span>Réservé ! Vérifiez votre email.</span>
                </div>
              )}
            </div>
          </div>

          {userEmail && bookings.length > 0 && (
            <BookingsList
              bookings={bookings}
              onCancel={cancelBooking}
              loading={loading}
            />
          )}
        </div>

        <BookingInfo />
      </div>

      <BookingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        loading={loading}
        error={error}
      />
    </div>
  );
}