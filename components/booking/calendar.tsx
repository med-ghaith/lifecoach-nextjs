import { useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  buildCalendarWeeks,
  getCalendarData,
  isPastDate,
} from "@/lib/utils";

interface CalendarProps {
  selectedDate: string | null;
  currentYear: number;
  currentMonth: number;
  onSelectDate: (date: string) => void;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  isDayFullyBooked: (date: string) => boolean;
}

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export default function Calendar({
  selectedDate,
  currentMonth,
  currentYear,
  onSelectDate,
  goToPreviousMonth,
  goToNextMonth,
  isDayFullyBooked,
}: CalendarProps) {
  const calendarData = useMemo(
    () => getCalendarData(currentYear, currentMonth),
    []
  );
  const { year, month } = calendarData;
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const weeks = buildCalendarWeeks(firstDay, daysInMonth);

  return (
    <>
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-6 w-6 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold text-black">
          Sélectionner une Date
        </h3>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-purple-100 rounded-full transition"
          aria-label="Mois précédent"
        >
          <ChevronLeft className="h-5 w-5 text-purple-600" />
        </button>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            {MONTHS[currentMonth]} {currentYear}
          </h2>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-purple-100 rounded-full transition"
          aria-label="Mois suivant"
        >
          <ChevronRight className="h-5 w-5 text-purple-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {DAYS.map((day) => (
          <div key={day} className="font-medium text-black py-1">
            {day}
          </div>
        ))}

        {weeks.flat().map((day, idx) => {
          if (day === null) return <div key={idx} className="py-3" />;

          const pad = (n: number) => n.toString().padStart(2, "0");
          const iso = `${year}-${pad(month + 1)}-${pad(day)}`; // YYYY-MM-DD

          const disabledDay =
            isPastDate(currentYear, currentMonth, day) || isDayFullyBooked(iso); // Disable past or fully booked

          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              disabled={disabledDay}
              className={`py-3 rounded-md transition text-black ${
                selectedDate === iso
                  ? "bg-purple-600 text-white border-transparent"
                  : "hover:bg-purple-50"
              } ${disabledDay ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );
}
