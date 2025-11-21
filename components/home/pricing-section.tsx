import Link from "next/link";
import { CheckCircle } from "lucide-react";

const packages = [
  {
    name: "Séance Unique",
    price: "50€",
    duration: "40 min",
    features: [
      "Séance de 40 minutes",
      "Première séance de 15 min gratuite",
      "Coaching personnalisé",
    ],
    highlighted: false,
  },
  {
    name: "Pack 3 Séances",
    price: "120€",
    pricePerSession: "40€/séance",
    features: [
      "3 séances de 40 minutes",
      "Idéal pour débuter",
      "Définir vos objectifs",
    ],
    highlighted: false,
  },
  {
    name: "Pack 5 Séances",
    price: "210€",
    badge: "PLUS POPULAIRE",
    pricePerSession: "42€/séance",
    features: [
      "5 séances de 40 minutes",
      "Suivi personnalisé",
      "Stratégies concrètes",
      "Support entre les séances",
    ],
    highlighted: true,
  },
  {
    name: "Pack 10 Séances",
    price: "450€",
    pricePerSession: "45€/séance",
    features: [
      "10 séances de 40 minutes",
      "Accompagnement complet",
      "Plan d'action détaillé",
      "Résultats durables",
    ],
    highlighted: false,
  },
  {
    name: "Pack Illimité",
    price: "1200€",
    badge: "ENGAGEMENT TOTAL",
    features: [
      "Séances illimitées pendant 1 an",
      "Disponibilité maximale",
      "Accompagnement intensif",
      "Transformation profonde",
    ],
    highlighted: false,
    fullWidth: true,
  },
  {
    name: "Programme Premium",
    price: "2000€",
    badge: "VIP",
    features: [
      "Accompagnement très intense",
      "Grande disponibilité du coach",
      "Support prioritaire 7j/7",
      "Programme sur-mesure",
      "Résultats garantis",
    ],
    highlighted: false,
    fullWidth: true,
  },
];

export default function PricingSection() {
  return (
    <div className="bg-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Les Tarifs
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Choisissez la formule qui correspond à vos besoins et à votre rythme
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {packages
            .filter((pkg) => !pkg.fullWidth)
            .map((pkg) => (
              <div
                key={pkg.name}
                className={`rounded-xl shadow-lg p-6 hover:shadow-2xl transition flex flex-col ${
                  pkg.highlighted
                    ? "bg-gradient-to-br from-purple-600 to-pink-500 transform scale-105"
                    : "bg-white transform hover:-translate-y-1"
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
                    pkg.highlighted ? "text-white" : "text-gray-800"
                  }`}
                >
                  {pkg.name}
                </h3>
                <p
                  className={`text-3xl font-bold mb-1 ${
                    pkg.highlighted ? "text-white" : "text-purple-600"
                  }`}
                >
                  {pkg.price}
                </p>
                {pkg.pricePerSession && (
                  <p
                    className={`text-sm mb-4 ${
                      pkg.highlighted ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {pkg.pricePerSession}
                  </p>
                )}
                {pkg.duration && (
                  <p
                    className={`text-sm mb-4 ${
                      pkg.highlighted ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {pkg.duration}
                  </p>
                )}
                <ul className="space-y-2 mb-6 flex-grow">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start text-sm">
                      <CheckCircle
                        className={`h-4 w-4 mr-2 mt-0.5 flex-shrink-0 ${
                          pkg.highlighted ? "text-white" : "text-purple-600"
                        }`}
                      />
                      <span
                        className={
                          pkg.highlighted ? "text-white" : "text-gray-600"
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
                      : "bg-purple-600 text-white hover:bg-purple-700"
                  }`}
                >
                  Réserver
                </Link>
              </div>
            ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {packages
            .filter((pkg) => pkg.fullWidth)
            .map((pkg) => (
              <div
                key={pkg.name}
                className="bg-gradient-to-r from-purple-700 to-pink-600 rounded-xl shadow-xl p-8 hover:shadow-2xl transition flex flex-col"
              >
                <div>
                  <div className="bg-yellow-400 text-gray-800 text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                    {pkg.badge}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {pkg.name}
                </h3>
                <p className="text-4xl font-bold text-white mb-6">
                  {pkg.price}
                </p>
                <ul className="space-y-3 mb-8 flex-grow">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start">
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
      </div>
    </div>
  );
}
