// components/admin/BookingsTable.tsx
import { BookingType, BookingStatus } from "@/types";
import StatusBadge from "./status-badge";

interface BookingsTableProps {
  bookings: BookingType[];
  onStatusChange: (id: string, status: BookingStatus) => void;
}

export default function BookingsTable({
  bookings,
  onStatusChange,
}: BookingsTableProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Réservations
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Date & Heure
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Forfait
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Statut
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {booking.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {booking.email}
                  </div>
                  {booking.phone && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.phone}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {new Date(booking.date).toLocaleDateString("fr-FR")}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {booking.time}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {booking.package || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      onStatusChange(
                        booking._id,
                        e.target.value as BookingStatus
                      )
                    }
                    className="text-sm border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="PENDING">En attente</option>
                    <option value="CONFIRMED">Confirmé</option>
                    <option value="COMPLETED">Terminé</option>
                    <option value="CANCELLED">Annulé</option>
                    <option value="NO_SHOW">Absent</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
