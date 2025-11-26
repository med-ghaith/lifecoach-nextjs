// app/admin/page.tsx or components/AdminDashboard.tsx
"use client";

import { useState } from "react";
import { Package, Calendar, Clock, CheckCircle } from "lucide-react";
import { PackageType, BookingType, BookingStatus } from "@/types";
import PackageModal from "@/components/admin/package-modal";
import BookingsTable from "@/components/admin/booking-tab";
import PackagesTable from "@/components/admin/package-tab";
import AdminTabs from "@/components/admin/admin-tab";
import StatsCard from "@/components/admin/stats-cards";
import TimeSlotsAdmin from "@/components/admin/timeslot-tab";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "packages" | "bookings" | "timeslots"
  >("packages");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<PackageType | null>(null);

  // Sample data - replace with your API calls
  const [packages, setPackages] = useState<PackageType[]>([
    {
      _id: "1",
      name: "Séance Découverte",
      price: 60,
      SeanceNumber: 1,
      duration: "1h",
      features: ["Entretien personnalisé", "Définition des objectifs"],
      badge: "Populaire",
    },
    {
      _id: "2",
      name: "Forfait 5 séances",
      price: 275,
      SeanceNumber: 5,
      duration: "5h",
      features: ["5 séances d'1h", "Suivi personnalisé", "Support email"],
      highlighted: true,
      discount: 10,
    },
  ]);

  const [bookings, setBookings] = useState<BookingType[]>([
    {
      _id: "1",
      name: "Marie Dubois",
      email: "marie@example.com",
      phone: "+33612345678",
      date: "2024-12-15",
      time: "14:00",
      status: "CONFIRMED",
      package: "Séance Découverte",
      message: "Première séance",
      createdAt: new Date("2024-12-01"),
      updatedAt: new Date("2024-12-01"),
    },
  ]);

  const [formData, setFormData] = useState<Partial<PackageType>>({
    name: "",
    price: 0,
    features: [""],
  });

  const handleCreatePackage = () => {
    setModalMode("create");
    setFormData({ name: "", price: 0, features: [""] });
    setShowModal(true);
  };

  const handleEditPackage = (pkg: PackageType) => {
    setModalMode("edit");
    setSelectedItem(pkg);
    setFormData(pkg);
    setShowModal(true);
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce forfait ?")) {
      setPackages(packages.filter((p) => p._id !== id));
    }
  };

  const handleSavePackage = () => {
    if (modalMode === "create") {
      const newPackage = {
        ...formData,
        _id: Date.now().toString(),
      } as PackageType;
      setPackages([...packages, newPackage]);
    } else {
      setPackages(
        packages.map((p) =>
          p._id === selectedItem?._id
            ? ({ ...formData, _id: p._id } as PackageType)
            : p
        )
      );
    }
    setShowModal(false);
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(
      bookings.map((b) =>
        b._id === id ? { ...b, status, updatedAt: new Date() } : b
      )
    );
  };

  const stats = [
    {
      name: "Total Forfaits",
      value: packages.length,
      icon: Package,
      color: "bg-purple-500",
    },
    {
      name: "Total Réservations",
      value: bookings.length,
      icon: Calendar,
      color: "bg-pink-500",
    },
    {
      name: "En Attente",
      value: bookings.filter((b) => b.status === "PENDING").length,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      name: "Confirmées",
      value: bookings.filter((b) => b.status === "CONFIRMED").length,
      icon: CheckCircle,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="min-h-screen  ">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tableau de Bord Admin
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <StatsCard key={stat.name} {...stat} />
          ))}
        </div>

        {/* Tabs */}
        <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Packages Tab */}
        {activeTab === "packages" && (
          <PackagesTable
            packages={packages}
            onEdit={handleEditPackage}
            onDelete={handleDeletePackage}
            onCreate={handleCreatePackage}
          />
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <BookingsTable
            bookings={bookings}
            onStatusChange={updateBookingStatus}
          />
        )}
        {/* TimeSlot Tab */}
        {activeTab === "timeslots" && <TimeSlotsAdmin />}
      </div>

      {/* Modal */}
      <PackageModal
        isOpen={showModal}
        mode={modalMode}
        formData={formData}
        onClose={() => setShowModal(false)}
        onSave={handleSavePackage}
        onFormChange={setFormData}
      />
    </div>
  );
}
