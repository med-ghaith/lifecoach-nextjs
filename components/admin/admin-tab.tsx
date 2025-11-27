// components/admin/AdminTabs.tsx
import { Package, Calendar } from "lucide-react";

interface AdminTabsProps {
  activeTab: "packages" | "bookings" | "freeBookings" | "timeslots";
  onTabChange: (
    tab: "packages" | "bookings" | "freeBookings" | "timeslots"
  ) => void;
}

export default function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => onTabChange("packages")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === "packages"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <Package className="w-5 h-5 inline-block mr-2" />
            Forfaits
          </button>
          <button
            onClick={() => onTabChange("bookings")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === "bookings"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <Calendar className="w-5 h-5 inline-block mr-2" />
            Réservations
          </button>
          <button
            onClick={() => onTabChange("freeBookings")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === "freeBookings"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <Calendar className="w-5 h-5 inline-block mr-2" />
            Réservations gratuites
          </button>
          <button
            onClick={() => onTabChange("timeslots")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition ${
              activeTab === "timeslots"
                ? "border-purple-500 text-purple-600 dark:text-purple-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400"
            }`}
          >
            <Calendar className="w-5 h-5 inline-block mr-2" />
            créneaux horaires
          </button>
        </nav>
      </div>
    </div>
  );
}
