"use client";

import { useState, useEffect } from "react";
import {
  getAllTimeSlots,
  createTimeSlot,
  deleteTimeSlot,
  updateTimeSlot,
} from "@/lib/actions/timeslot.action";
import { Plus, Trash2, Edit2 } from "lucide-react";

export default function TimeSlotsAdmin() {
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    startTime: "09:00",
    endTime: "09:40",
    isAvailable: true,
    maxBookings: 1,
  });

  useEffect(() => {
    fetchTimeSlots();
  }, []);

  const fetchTimeSlots = async () => {
    setLoading(true);
    const result = await getAllTimeSlots();
    if (result.success && result.timeSlots) {
      setTimeSlots(result.timeSlots);
    }
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!formData.date) {
      alert("Veuillez choisir une date");
      return;
    }

    const result = await createTimeSlot(formData);
    if (result.success) {
      setShowAddForm(false);
      setFormData({
        date: "",
        startTime: "09:00",
        endTime: "09:40",
        isAvailable: true,
        maxBookings: 1,
      });
      fetchTimeSlots();
    } else {
      alert(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce créneau ?")) {
      const result = await deleteTimeSlot(id);
      if (result.success) fetchTimeSlots();
    }
  };
  const handleUpdate = async (id: string, data: any) => {
    const result = await updateTimeSlot(id, data);
    if (result.success) {
      setEditingId(null);
      fetchTimeSlots();
    }
  };

  const toggleAvailability = async (slot: any) => {
    const result = await updateTimeSlot(slot._id, {
      isAvailable: !slot.isAvailable,
    });
    if (result.success) fetchTimeSlots();
  };

  const slotsByDate = timeSlots.reduce((acc: any, slot: any) => {
    if (!acc[slot.date]) acc[slot.date] = [];
    acc[slot.date].push(slot);
    return acc;
  }, {});

  return (
    <div className="pt-6 max-w-5xl  mx-auto px-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestion des Créneaux Horaires
        </h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Plus className="h-5 w-5" />
          Ajouter un Créneau
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Nouveau Créneau</h3>

          <div className="grid grid-cols-6 gap-4 items-end">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Début</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Fin</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full border rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Disponible
              </label>
              <input
                type="checkbox"
                checked={formData.isAvailable}
                onChange={(e) =>
                  setFormData({ ...formData, isAvailable: e.target.checked })
                }
                className="mt-2"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleAdd}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grouped Time Slots */}
      <div className="space-y-8">
        {Object.keys(slotsByDate).length === 0 && !loading && (
          <p className="text-gray-500">Aucun créneau configuré.</p>
        )}

        {Object.keys(slotsByDate)
          .sort()
          .map((date) => (
            <div key={date} className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {new Date(date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h3>

              <div className="space-y-3">
                {slotsByDate[date].map((slot: any) => (
                  <div
                    key={slot._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    {editingId === slot._id ? (
                      /* ---------------- EDIT MODE ---------------- */
                      <div className="w-full flex items-center justify-between">
                        <div className="flex gap-3">
                          <div>
                            <label className="text-xs text-gray-500">
                              Début
                            </label>
                            <input
                              type="time"
                              defaultValue={slot.startTime}
                              onChange={(e) =>
                                (slot.startTime = e.target.value)
                              }
                              className="border rounded p-1"
                            />
                          </div>

                          <div>
                            <label className="text-xs text-gray-500">Fin</label>
                            <input
                              type="time"
                              defaultValue={slot.endTime}
                              onChange={(e) => (slot.endTime = e.target.value)}
                              className="border rounded p-1"
                            />
                          </div>

                          <div className="flex items-center">
                            <label className="mr-2 text-xs text-gray-500">
                              Disponible
                            </label>
                            <input
                              type="checkbox"
                              defaultChecked={slot.isAvailable}
                              onChange={(e) =>
                                (slot.isAvailable = e.target.checked)
                              }
                            />
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {/* Save */}
                          <button
                            onClick={() =>
                              handleUpdate(slot._id, {
                                startTime: slot.startTime,
                                endTime: slot.endTime,
                                isAvailable: slot.isAvailable,
                              })
                            }
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded"
                          >
                            Enregistrer
                          </button>

                          {/* Cancel */}
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1 bg-gray-300 text-sm rounded"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* ---------------- VIEW MODE ---------------- */
                      <>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">
                            {slot.startTime} - {slot.endTime}
                          </span>

                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              slot.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {slot.isAvailable ? "Disponible" : "Indisponible"}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          {/* Toggle Edit Mode */}
                          <button
                            onClick={() => setEditingId(slot._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(slot._id)} // replace confirm()
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
