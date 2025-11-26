// app/admin/page.tsx or components/AdminDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { Package, Calendar, Clock, CheckCircle } from "lucide-react";
import { PackageType, BookingType, BookingStatus } from "@/types";
import PackageModal from "@/components/admin/package-modal";
import BookingsTable from "@/components/admin/booking-tab";
import PackagesTable from "@/components/admin/package-tab";
import AdminTabs from "@/components/admin/admin-tab";
import StatsCard from "@/components/admin/stats-cards";
import TimeSlotsAdmin from "@/components/admin/timeslot-tab";
import {
  createPackage,
  deletePackage,
  getAllPackages,
  PackageInput,
  updatePackage,
} from "@/lib/actions/package.action";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Toast } from "@/components/Toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "packages" | "bookings" | "timeslots"
  >("packages");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<PackageType | null>(null);

  // Sample data - replace with your API calls
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data: any = await getAllPackages();
        setPackages(data);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

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

  const [formData, setFormData] = useState<Partial<PackageInput>>({
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
    setDeleteId(id); // opens the confirmation modal
  };
  const confirmDeletePackage = async () => {
    if (!deleteId) return;

    try {
      const success = await deletePackage(deleteId);
      if (success) {
        setPackages(packages.filter((p) => p._id !== deleteId));
        setToast({
          message: "Forfait supprimé avec succès !",
          type: "success",
        });
      } else {
        setToast({
          message: "Échec de la suppression du forfait.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Delete package error:", error);
      setToast({
        message: "Erreur lors de la suppression du forfait.",
        type: "error",
      });
    } finally {
      setDeleteId(null); // close the confirmation modal
    }
  };

  const handleSavePackage = async () => {
    if (modalMode === "create") {
      const newPkg = await createPackage(formData as PackageInput);
      console.log(formData as PackageInput, "++++++");
      if (newPkg)
        setPackages([
          ...packages,
          {
            ...newPkg,
            _id: newPkg._id.toString(),
          },
        ]);
    } else if (selectedItem) {
      const updatedPkg = await updatePackage(
        selectedItem._id,
        formData as Partial<PackageInput>
      );
      if (updatedPkg) {
        setPackages(
          packages.map((p) => (p._id === updatedPkg._id ? updatedPkg : p))
        );
      }
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
        <ConfirmModal
          isOpen={!!deleteId}
          message="Êtes-vous sûr de vouloir supprimer ce forfait ?"
          onConfirm={confirmDeletePackage}
          onCancel={() => setDeleteId(null)}
        />

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
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
