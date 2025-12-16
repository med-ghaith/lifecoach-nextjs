"use client";

import { useState, FormEvent } from "react";
import { X, Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { usePackages } from "@/hooks/use-package";
import { TimeSlot } from "@/hooks/use-bookings";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<boolean>;
  selectedDate: string | null;
  selectedTimeSlots: TimeSlot[];
  selectedPackage: string | null;
  onPackageSelect: (packageId: string) => void;
  loading?: boolean;
  error?: string | null;
}

export default function BookingModal({
  isOpen,
  onClose,
  selectedDate,
  selectedTimeSlots,
  selectedPackage,
  onPackageSelect,
  loading = false,
  error = null,
  onSubmit,
}: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [paypalError, setPaypalError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { isLoading, packages } = usePackages();
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const success = await onSubmit(formData);
    if (success) {
      setFormData({ name: "", email: "", phone: "" });
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
      error = null;
    }
  };

  const selectedPackageData = packages.find((p) => p._id === selectedPackage);
  const amount = selectedPackageData
    ? selectedPackageData.discount
      ? selectedPackageData.price +
        (selectedPackageData.price * selectedPackageData.discount) / 100
      : selectedPackageData.price
    : 0;
  const createOrder = async () => {
    const res = await fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "create",
        name: formData.name,
        email: formData.email,
        amount: amount.toFixed(2),
      }),
    });

    const data = await res.json();
    if (!data.orderID) throw new Error("No orderID returned from server");
    return data.orderID;
  };

  const onApprove = async (orderID: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "capture",
          name: formData.name,
          email: formData.email,
          amount: amount.toFixed(2),
          orderID,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Capture failed");
      setPaymentSuccess(true);
      // Call handleSubmit WITHOUT event since this is not a form submit
      const success = await onSubmit(formData);
      if (success) {
        setFormData({ name: "", email: "", phone: "" });
      }
    } catch (err) {
      console.error(err);
      setPaypalError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (err: any) => {
    console.error("PayPal error:", err);
    setPaypalError("An error occurred with PayPal. Please try again.");
  };
  // Static amount for now

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            disabled={loading}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Confirmer votre réservation
            </h3>
            <p className="text-sm text-gray-600">
              Veuillez remplir vos informations pour finaliser la réservation
            </p>
          </div>

          {/* Selected slots info */}
          {selectedTimeSlots && selectedTimeSlots.length > 0 && (
            <div className="bg-purple-50 rounded-lg p-4 mb-6 space-y-3">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    Créneaux réservés
                  </p>
                  <div className="space-y-1 mt-2">
                    {selectedTimeSlots &&
                      selectedTimeSlots.map((slot: any, idx: any) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Clock className="h-4 w-4 text-purple-500" />
                          <span className="font-medium text-gray-900">
                            {formatDate(slot.date)} à {slot.time}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {selectedPackageData && (
                <div className="flex items-center justify-between pt-3 border-t border-purple-200">
                  <span className="text-sm font-medium text-gray-700">
                    {selectedPackageData.name}
                  </span>
                  <span className="font-bold text-purple-600">{amount}€</span>
                </div>
              )}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-4">
              ❌ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Package Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Forfait <span className="text-red-500">*</span>
              </label>
              {isLoading ? (
                <div className="text-sm text-gray-500">
                  Chargement des forfaits...
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {packages
                    .filter((pkg) => {
                      if (!selectedPackage) {
                        return pkg.name.toLowerCase() === "free";
                      }
                      return pkg._id == selectedPackage;
                    })
                    .map((pkg) => (
                      <label
                        key={pkg._id}
                        className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition ${
                          selectedPackage === pkg._id
                            ? "border-purple-600 bg-purple-50"
                            : "border-gray-300 hover:border-purple-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="package"
                          value={pkg._id}
                          checked={selectedPackage === pkg._id}
                          onChange={(e) => onPackageSelect(e.target.value)}
                          className="mr-3"
                          disabled={loading}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {pkg.name}
                            </span>
                            <span className="font-bold text-purple-600">
                              {amount}€
                            </span>
                          </div>
                          {pkg.features && pkg.features.length > 0 && (
                            <p className="text-xs text-gray-500 mt-1">
                              {pkg.features.join(", ")}
                            </p>
                          )}
                          {pkg.sessions && (
                            <p className="text-xs text-gray-500 mt-1">
                              {pkg.sessions} séance(s)
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                </div>
              )}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  disabled={loading}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  disabled={loading}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  disabled={loading}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                  placeholder="+33 6 12 34 56 78"
                />
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                ✨ <strong>Première séance gratuite !</strong>
                <br />
                Vous recevrez un email de confirmation avec tous les détails.
              </p>
            </div>
            {/* PayPal Buttons */}
            <div className="mt-4">
              {paypalError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                  {paypalError}
                </div>
              )}
              {paymentSuccess && (
                <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg text-sm">
                  Paiement effectué avec succès.
                </div>
              )}
              {amount !== 0 && (
                <PayPalScriptProvider
                  options={{
                    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
                    currency: "EUR",
                    intent: "capture",
                  }}
                >
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    disabled={
                      isProcessing ||
                      !formData.name ||
                      !formData.email ||
                      !selectedPackageData
                    }
                    // Create order by calling backend
                    createOrder={async () => {
                      setPaypalError("");
                      try {
                        const orderID = await createOrder(); // your function returns orderID
                        return orderID;
                      } catch (err) {
                        setPaypalError(
                          "Failed to create order. Please try again."
                        );
                        throw err;
                      }
                    }}
                    // Capture order by calling backend
                    onApprove={async (data) => {
                      setPaypalError("");
                      try {
                        await onApprove(data.orderID); // send orderID to backend
                      } catch (err) {
                        setPaypalError("Error capturing PayPal payment");
                      }
                    }}
                    onError={onError}
                  />
                </PayPalScriptProvider>
              )}
            </div>
            {/* Buttons */}
            {amount === 0 && (
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={
                    loading ||
                    !formData.name ||
                    !formData.email ||
                    !selectedPackage
                  }
                  className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Réservation..." : "Confirmer"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
