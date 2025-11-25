import { MessageCircleHeart } from "lucide-react";

const testimonials = [
  {
    name: "Guillemette Eichenlau",
    message:
      "Marnie est une coach de vie douce et optimiste que je recommande vivement à toute personne ayant besoin d’un soutien sincère et bienveillant.",
  },
  {
    name: "Jean-Baptiste Marçon",
    message: "Très compétente, de très bon conseils. Je recommande vivement.",
    date: "12 Juin 2025",
  },
  {
    name: "Coco Milie",
    message:
      "Une rencontre lumineuse et bienveillante. Léopoldine a su m’accompagner avec douceur, comprendre mes besoins et m’aider à reprendre confiance. Une expérience presque magique.",
    date: "16 Juillet 2025",
  },
  {
    name: "Antonin Bell",
    message:
      "Excellente coach ! Avec bienveillance et empathie j’ai réussi à trouver mon âme sœur en deux semaines.",
    date: "30 Février 2025",
  },
  {
    name: "Anaïs Juban — Suisse",
    message:
      "Le coaching a dépassé mes attentes. Il m’a permis de mieux me connaître et d'agir en phase avec mes valeurs. Une personne bienveillante, perspicace et flexible. Une étape importante de ma vie.",
  },
  {
    name: "Marie-Madeleine C — Luxembourg",
    message:
      "J’ai compris les comportements qui me faisaient grossir. Léopoldine m’a aidé à changer durablement ma vision de moi-même. Bonus : elle m’aide aussi à lancer mon activité en ligne.",
  },
];

export default function TestimonialsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Témoignages de Patients
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Découvrez ce que mes accompagnements ont permis à mes clients de
          transformer dans leur vie.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition"
          >
            <MessageCircleHeart className="h-10 w-10 text-purple-600 mb-4" />

            <p className="text-gray-700 italic leading-relaxed mb-4">
              "{t.message}"
            </p>

            <div className="mt-4">
              <p className="font-semibold text-gray-800">{t.name}</p>
              {t.date && <p className="text-sm text-gray-500">{t.date}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
