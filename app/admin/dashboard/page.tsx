// app/admin/page.tsx or components/AdminDashboard.tsx
"use client";

import { useState } from "react";
import { Package, Calendar, Clock, CheckCircle } from "lucide-react";
import { PackageType,  BookingStatus } from "@/types";
import PackageModal from "@/components/admin/package-modal";
import BookingsTable from "@/components/admin/booking-tab";
import PackagesTable from "@/components/admin/package-tab";
import AdminTabs from "@/components/admin/admin-tab";
import StatsCard from "@/components/admin/stats-cards";
import TimeSlotsAdmin from "@/components/admin/timeslot-tab";
import { PackageInput } from "@/lib/actions/package.action";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { Toast } from "@/components/Toast";
import { usePackages } from "@/hooks/use-package";
import { useBookings } from "@/hooks/use-bookings";
import { bookingStatusEmailTemplate } from "@/lib/bookingStatusTemplate";
import { updateBookingStatus } from "@/lib/actions/booking.action";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<
    "packages" | "bookings" | "freeBookings" | "timeslots"
  >("packages");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedItem, setSelectedItem] = useState<PackageType | null>(null);

  // Sample data - replace with your API calls
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const {
    refreshPackages,
    packages,
    createPackage,
    updatePackage,
    deletePackage,
  } = usePackages();

  const { allBookings, setAllBookings, bookings } = useBookings();

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
      const success: any = await deletePackage(deleteId);
      if (success) {
        await refreshPackages();
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
      await createPackage(formData as PackageInput);
    } else if (selectedItem) {
      await updatePackage(selectedItem._id, formData as Partial<PackageInput>);
    }
    await refreshPackages();
    setShowModal(false);
  };

  const handleUpdateBookingStatus = async (
    id: string,
    status: BookingStatus
  ) => {
    try {
      await updateBookingStatus(id, status);
      setAllBookings(
        allBookings.map((b) =>
          b._id === id ? { ...b, status, updatedAt: new Date() } : b
        )
      );

      const booking = allBookings.find((b) => b._id === id);
      console.log(bookings);
      if (booking) {
        const result = await bookingStatusEmailTemplate(
          booking.email,
          booking.name,
          status,
          booking.date,
          booking.time
        );

        if (result?.success) {
          setToast({
            message: "changement de status.",
            type: "success",
          });
        }
      }
    } catch (error) {
      setToast({
        message: "Erreur lors changement de status.",
        type: "error",
      });
    }
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
      value: allBookings.length,
      icon: Calendar,
      color: "bg-pink-500",
    },
    {
      name: "En Attente",
      value: allBookings.filter((b) => b.status === "PENDING").length,
      icon: Clock,
      color: "bg-yellow-500",
    },
    {
      name: "Confirmées",
      value: allBookings.filter((b) => b.status === "CONFIRMED").length,
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
            bookings={allBookings}
            onStatusChange={handleUpdateBookingStatus}
            type={activeTab}
          />
        )}
        {activeTab === "freeBookings" && (
          <BookingsTable
            bookings={allBookings}
            onStatusChange={handleUpdateBookingStatus}
            type={activeTab}
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
