export interface Booking {
  date: string;
  time: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface CalendarData {
  year: number;
  month: number;
  firstDay: number;
  daysInMonth: number;
}
// types.ts
export interface PackageType {
  _id: string;
  name: string;
  price: number;
  SeanceNumber?: number;
  duration?: string;
  features: string[];
  highlighted?: boolean;
  fullWidth?: boolean;
  badge?: string;
  discount?: number;
}

export interface BookingType {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";
  message?: string;
  package?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = BookingType["status"];
