"use client";
import Link from "next/link";
import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllPackages } from "@/lib/actions/package.action";

export interface Package {
  _id: string;
  name: string;
  price: number;
  SeanceNumber?: number;
  duration?: string;
  features: string[];
  highlighted?: boolean;
  fullWidth?: boolean;
  badge?: string;
  discount?: number;
}

export default function PricingSection() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPackages() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await getAllPackages();
        const formattedPackages = res.map((pkg) => ({
          ...pkg,
          _id: pkg._id.toString(),
        }));
        setPackages(formattedPackages);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
        setError("Impossible de charger les forfaits. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPackages();
  }, []);
  return (
    <div className="  py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center  text-white-100 mb-4">
          Les Tarifs
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-3xl text-lg mx-auto">
          Choisissez la formule qui correspond à vos besoins et à votre rythme
        </p>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-purple-600  animate-spin mb-4" />
            <p className="text-gray-600  text-lg">
              Chargement des forfaits...
            </p>
          </div>
        )}
        {/* Packages Display */}
        {!isLoading && !error && packages.length > 0 && (
          <>
            {/* Regular Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {packages
                .filter((pkg) => !pkg.fullWidth)
                .map((pkg) => (
                  <div
                    key={pkg._id}
                    className={`rounded-xl shadow-lg p-6 hover:shadow-2xl transition flex flex-col ${
                      pkg.highlighted
                        ? "bg-gradient-to-br from-purple-600 to-pink-500 transform scale-105"
                        : "bg-white   transform hover:-translate-y-1"
                    }`}
                  >
                    <div>
                      {pkg.badge && (
                        <div className="bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-3">
                          {pkg.badge}
                        </div>
                      )}
                    </div>
                    <h3
                      className={`text-xl font-bold mb-2 ${
                        pkg.highlighted
                          ? "text-white"
                          : "text-gray-800 "
                      }`}
                    >
                      {pkg.name}
                    </h3>
                    <div className="mb-1">
                      {pkg.discount ? (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <p
                              className={`text-lg font-semibold line-through opacity-60 ${
                                pkg.highlighted
                                  ? "text-white/70"
                                  : "text-gray-400 "
                              }`}
                            >
                              {pkg.price}€
                            </p>
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                pkg.highlighted
                                  ? "bg-white/20 text-white"
                                  : "bg-red-100 text-red-600 "
                              }`}
                            >
                              -{pkg.discount}%
                            </span>
                          </div>
                          <p
                            className={`text-3xl font-bold ${
                              pkg.highlighted
                                ? "text-white"
                                : "text-purple-600"
                            }`}
                          >
                            {(pkg.price * (1 - pkg.discount / 100)).toFixed(2)}€
                          </p>
                        </>
                      ) : (
                        <p
                          className={`text-3xl font-bold ${
                            pkg.highlighted
                              ? "text-white"
                              : "text-purple-600 "
                          }`}
                        >
                          {pkg.price}€
                        </p>
                      )}
                    </div>
                    {pkg.SeanceNumber && (
                      <p
                        className={`text-sm mb-4 ${
                          pkg.highlighted
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}
                      >
                        {pkg.discount
                          ? (
                              (pkg.price * (1 - pkg.discount / 100)) /
                              pkg.SeanceNumber
                            ).toFixed(2)
                          : (pkg.price / pkg.SeanceNumber).toFixed(2)}
                        €/séance
                      </p>
                    )}
                    {pkg.duration && (
                      <p
                        className={`text-sm mb-4 ${
                          pkg.highlighted
                            ? "text-white/80"
                            : "text-gray-500"
                        }`}
                      >
                        {pkg.duration}
                      </p>
                    )}
                    <ul className="space-y-2 mb-6 flex-grow">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <CheckCircle
                            className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${
                              pkg.highlighted
                                ? "text-white"
                                : "text-purple-600"
                            }`}
                          />
                          <span
                            className={
                              pkg.highlighted
                                ? "text-white"
                                : "text-gray-600"
                            }
                          >
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/booking"
                      className={`block w-full text-center py-2.5 rounded-lg transition font-semibold text-sm ${
                        pkg.highlighted
                          ? "bg-white text-purple-600 hover:bg-purple-100"
                          : "bg-purple-600 text-white hover:bg-purple-700 "
                      }`}
                    >
                      Réserver
                    </Link>
                  </div>
                ))}
            </div>

            {/* Full Width Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {packages
                .filter((pkg) => pkg.fullWidth)
                .map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-gradient-to-r from-purple-700 to-pink-600 rounded-xl shadow-xl p-8 hover:shadow-2xl transition flex flex-col"
                  >
                    <div>
                      {pkg.badge && (
                        <div className="bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                          {pkg.badge}
                        </div>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {pkg.name}
                    </h3>
                    <div className="mb-6">
                      {pkg.discount ? (
                        <>
                          <div className="flex items-center gap-3 mb-2">
                            <p className="text-2xl font-semibold line-through text-white/60">
                              {pkg.price}€
                            </p>
                            <span className="bg-yellow-400 text-gray-800 text-sm font-bold px-3 py-1 rounded-full">
                              -{pkg.discount}%
                            </span>
                          </div>
                          <p className="text-4xl font-bold text-white">
                            {(pkg.price * (1 - pkg.discount / 100)).toFixed(2)}€
                          </p>
                        </>
                      ) : (
                        <p className="text-4xl font-bold text-white">
                          {pkg.price && `${pkg.price}€`}
                        </p>
                      )}
                    </div>
                    <ul className="space-y-3 mb-8 flex-grow">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-white mr-2 mt-1 flex-shrink-0" />
                          <span className="text-white">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/booking"
                      className="block w-full text-center bg-white text-purple-600 py-3 rounded-lg font-semibold transition hover:bg-purple-100"
                    >
                      Réserver
                    </Link>
                  </div>
                ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && packages.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600  text-lg">
              Aucun forfait disponible pour le moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
