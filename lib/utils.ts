import { CalendarData } from "@/types";

export const formatISO = (year: number, month: number, day: number): string => {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
};

export const getCalendarData = (year: number, month: number): CalendarData => {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // last day of month
  return { year, month, firstDay, daysInMonth };
};

export const buildCalendarWeeks = (
  firstDayOfMonth: number, // 0 = Sunday, 1 = Monday, etc.
  daysInMonth: number
): (number | null)[][] => {
  const weeks: (number | null)[][] = [];
  let currentDay = 1;

  while (currentDay <= daysInMonth) {
    const week: (number | null)[] = [];

    for (let i = 0; i < 7; i++) {
      // Fill empty cells before the first day of the month
      if (weeks.length === 0 && i < firstDayOfMonth) {
        week.push(null);
      } else if (currentDay > daysInMonth) {
        // Fill empty cells after the last day of the month
        week.push(null);
      } else {
        week.push(currentDay);
        currentDay++;
      }
    }

    weeks.push(week);
  }

  return weeks;
};

export const isPastDate = (year: number, month: number, day: number) => {
  const today = new Date();

  // If the year is in the past → disable
  if (year < today.getFullYear()) return true;

  // If the year is current, but month is in the past → disable
  if (year === today.getFullYear() && month < today.getMonth()) return true;

  // If the year and month are current, but day is in the past → disable
  if (
    year === today.getFullYear() &&
    month === today.getMonth() &&
    day < today.getDate()
  )
    return true;

  // Otherwise → not past
  return false;
};
