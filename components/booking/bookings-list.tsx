import { CalendarIcon, Loader2 } from "lucide-react";

interface Booking {
  _id: string;
  name: string;
  email: string;
  date: string;
  time: string;
  status?: string;
  package?: string;
}

interface BookingsListProps {
  bookings: Booking[];
  onCancel: (id: string) => Promise<boolean>;
  loading?: boolean;
}

export default function BookingsList({
  bookings,
  onCancel,
  loading,
}: BookingsListProps) {
  const handleCancel = async (id: string) => {
    if (!id) return;

    if (
      confirm(
        "Êtes-vous sûr de vouloir annuler cette réservation ? Cette action est irréversible."
      )
    ) {
      await onCancel(id);
    }
  };

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            Confirmé
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
            En attente
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
            Annulé
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Terminé
          </span>
        );
      case "NO_SHOW":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
            Absent
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 bg-white rounded-lg shadow p-6">
      <h4 className="font-semibold mb-4 text-lg">Mes Réservations</h4>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
          <span className="ml-2 text-gray-600">Chargement...</span>
        </div>
      )}

      {!loading && bookings.length === 0 && (
        <div className="text-center py-8">
          <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Aucune réservation pour le moment.</p>
          <p className="text-sm text-gray-400 mt-1">
            Sélectionnez une date et une heure pour réserver une séance.
          </p>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <ul className="space-y-3">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 rounded-full p-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {formatDate(booking.date)} à {booking.time}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                    {getStatusBadge(booking.status)}
                    {booking.package && (
                      <span className="text-xs text-gray-400">
                        • {booking.package}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {booking.status !== "CANCELLED" &&
                booking.status !== "COMPLETED" && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="text-sm text-red-500 hover:text-red-700 transition font-medium px-4 py-2 rounded hover:bg-red-50"
                  >
                    Annuler
                  </button>
                )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
