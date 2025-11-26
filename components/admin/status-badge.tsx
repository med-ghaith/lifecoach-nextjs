// components/admin/StatusBadge.tsx
import { Clock, CheckCircle, XCircle, Check, AlertCircle } from "lucide-react";
import { BookingStatus } from "@/types";

interface StatusBadgeProps {
  status: BookingStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    PENDING: {
      bg: "bg-yellow-100 dark:bg-yellow-900/30",
      text: "text-yellow-800 dark:text-yellow-400",
      icon: Clock,
    },
    CONFIRMED: {
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-800 dark:text-green-400",
      icon: CheckCircle,
    },
    CANCELLED: {
      bg: "bg-red-100 dark:bg-red-900/30",
      text: "text-red-800 dark:text-red-400",
      icon: XCircle,
    },
    COMPLETED: {
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-800 dark:text-blue-400",
      icon: Check,
    },
    NO_SHOW: {
      bg: "bg-gray-100 dark:bg-gray-900/30",
      text: "text-gray-800 dark:text-gray-400",
      icon: AlertCircle,
    },
  }[status];

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {status}
    </span>
  );
}
