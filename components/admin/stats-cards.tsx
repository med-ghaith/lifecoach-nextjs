// components/admin/StatsCard.tsx
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  name: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({
  name,
  value,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{name}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {value}
          </p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
