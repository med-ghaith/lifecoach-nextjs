"use client";

import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { PackageInput } from "@/lib/actions/package.action";

interface PackageModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  formData: Partial<PackageInput>;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (data: Partial<PackageInput>) => void;
}

export default function PackageModal({
  isOpen,
  mode,
  formData,
  onClose,
  onSave,
  onFormChange,
}: PackageModalProps) {
  const [newFeature, setNewFeature] = useState("");

  if (!isOpen) return null;

  const addFeature = () => {
    if (newFeature.trim()) {
      onFormChange({
        ...formData,
        features: [...(formData.features || []), newFeature],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    onFormChange({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index) || [],
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    onFormChange({ ...formData, features: newFeatures });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {mode === "create" ? "Nouveau Forfait" : "Modifier le Forfait"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="package-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Nom du forfait
            </label>
            <input
              id="package-name"
              type="text"
              value={formData.name || ""}
              onChange={(e) =>
                onFormChange({ ...formData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Nom du forfait"
            />
          </div>

          {/* Price & Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="package-price"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Prix (€)
              </label>
              <input
                id="package-price"
                type="number"
                value={formData.price || 0}
                onChange={(e) =>
                  onFormChange({ ...formData, price: Number(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Prix (€)"
              />
            </div>
            <div>
              <label
                htmlFor="package-discount"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Remise (%)
              </label>
              <input
                id="package-discount"
                type="number"
                value={formData.remis || ""}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    remis: Number(e.target.value) || undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Remise (%)"
              />
            </div>
          </div>

          {/* SeanceNumber & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="package-seancenumber"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Nombre de Séances
              </label>
              <input
                id="package-seancenumber"
                type="number"
                value={formData.SeanceNumber || 0}
                onChange={(e) =>
                  onFormChange({
                    ...formData,
                    SeanceNumber: Number(e.target.value),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Nombre de Séances"
              />
            </div>
            <div>
              <label
                htmlFor="package-duration"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Durée
              </label>
              <input
                id="package-duration"
                type="text"
                value={formData.duration || ""}
                onChange={(e) =>
                  onFormChange({ ...formData, duration: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Ex: 1h, 45min"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Caractéristiques
            </label>
            <div className="space-y-2">
              {formData.features?.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => removeFeature(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFeature()}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Nouvelle caractéristique"
                />
                <button
                  onClick={addFeature}
                  className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            {mode === "create" ? "Créer" : "Enregistrer"}
          </button>
        </div>
      </div>
    </div>
  );
}
