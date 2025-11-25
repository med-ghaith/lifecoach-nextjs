import { CheckCircle, Star, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Qui Je Suis</h2>
          <p className="text-lg text-gray-600 mb-4">
            Bonjour, je suis <strong>Léopoldine Almeida</strong>, coach de vie
            spécialisée dans l'accompagnement des personnes qui souhaitent
            retrouver clarté, confiance et équilibre.
          </p>
          <p className="text-lg text-gray-600 mb-4">
            J'aide mes clients à dépasser leurs blocages, à définir des
            objectifs alignés avec leurs valeurs et à construire une vie plus
            sereine et plus engagée.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Mon approche est à la fois bienveillante, stratégique et concrète,
            pour transformer vos prises de conscience en résultats durables.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">
                Approche holistique et personnalisée
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">
                Intelligence émotionnelle au cœur du coaching
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">
                Stratégies concrètes pour des résultats durables
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br relative from-purple-100 to-pink-100 rounded-2xl p-8 h-96 flex items-center justify-center">
          <div className="text-center">
            <Image
              src="/images/anxiety-management.jpeg"
              alt="about me"
              fill
              className="object-cover transition-transform duration-300 hover:scale-110"
            />
            <p className="text-gray-700 italic text-lg font-medium mb-2">
              "Les sirènes naissent de la contrainte dont elles s'extraient
              autant que de la liberté qu'elles s'offrent."
            </p>
            <p className="text-sm text-gray-600 mt-4">
              Je crois en la puissance de la pluralité et au réveil de votre
              essence véritable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
