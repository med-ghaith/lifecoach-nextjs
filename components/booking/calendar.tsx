import { useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { CalendarData } from "@/types";
import { formatISO, buildCalendarWeeks } from "@/lib/utils";

interface CalendarProps {
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
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

const getCalendarData = (year: number, month: number): CalendarData => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { year, month, firstDay, daysInMonth };
};

export default function Calendar({
  selectedDate,
  onSelectDate,
}: CalendarProps) {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());

  const calendarData = getCalendarData(currentYear, currentMonth);
  const { year, month, firstDay, daysInMonth } = calendarData;
  const weeks = buildCalendarWeeks(firstDay, daysInMonth);

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

  return (
    <>
      <div className="flex items-center mb-4">
        <CalendarIcon className="h-6 w-6 text-purple-600 mr-2" />
        <h3 className="text-lg font-semibold">Sélectionner une Date</h3>
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
          <div key={day} className="font-medium text-gray-500 py-1">
            {day}
          </div>
        ))}

        {weeks.flat().map((day, idx) => {
          if (day === null) return <div key={idx} className="py-3" />;
          const iso = formatISO(year, month, day);
          return (
            <button
              key={iso}
              onClick={() => onSelectDate(iso)}
              className={`py-3 rounded-md transition ${
                selectedDate === iso
                  ? "bg-purple-600 text-white"
                  : "hover:bg-purple-50"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </>
  );
}
