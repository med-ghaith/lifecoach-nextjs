import { CalendarData } from "@/types";

export const formatISO = (year: number, month: number, day: number): string => {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

export const getCalendarData = (year: number, month: number): CalendarData => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { year, month, firstDay, daysInMonth };
};

export const buildCalendarWeeks = (
  firstDay: number,
  daysInMonth: number
): (number | null)[][] => {
  const weeks: (number | null)[][] = [];
  let dayCounter = 1 - firstDay;

  while (dayCounter <= daysInMonth) {
    const week: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (dayCounter < 1 || dayCounter > daysInMonth) {
        week.push(null);
      } else {
        week.push(dayCounter);
      }
      dayCounter++;
    }
    weeks.push(week);
  }
  return weeks;
};
