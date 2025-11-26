import { Clock } from "lucide-react";

interface TimeSlotsProps {
  timeSlots: string[];
  selectedDate: string | null;
  selectedTime: string | null;
  onSelectTime: (time: string) => void;
  isDateBooked: (date: string, time: string) => boolean;
}

export default function TimeSlots({
  timeSlots,
  selectedDate,
  selectedTime,
  onSelectTime,
  isDateBooked,
}: TimeSlotsProps) {
  return (
    <div className="mt-6">
      <h4 className="font-semibold mb-2 text-black">Choisir une heure</h4>
      <div className="flex flex-wrap gap-3 text-black">
        {timeSlots.map((time) => {
          const disabled = selectedDate
            ? isDateBooked(selectedDate, time)
            : false;
          return (
            <button
              key={time}
              disabled={!selectedDate || disabled}
              onClick={() => onSelectTime(time)}
              className={`px-3 py-2 rounded-lg border transition ${
                selectedTime === time
                  ? "bg-purple-600 text-white border-transparent"
                  : "hover:bg-gray-100"
              } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{time}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
