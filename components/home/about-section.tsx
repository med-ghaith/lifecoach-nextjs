import { CheckCircle, Star, Sparkles } from "lucide-react";
import Image from "next/image";

export default function AboutSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900  mb-6">
            Qui Je Suis
          </h2>
          <p className="text-lg dark:text-gray-400 text-gray-600 mb-4">
            Bonjour, je suis <strong>Léopoldine Almeida</strong>, coach de vie
            spécialisée dans l'accompagnement des personnes qui souhaitent
            retrouver clarté, confiance et équilibre.
          </p>
          <p className="text-lg dark:text-gray-400 text-gray-600 mb-4">
            J'aide mes clients à dépasser leurs blocages, à définir des
            objectifs alignés avec leurs valeurs et à construire une vie plus
            sereine et plus engagée.
          </p>
          <p className="text-lg dark:text-gray-400 text-gray-600 mb-6">
            Mon approche est à la fois bienveillante, stratégique et concrète,
            pour transformer vos prises de conscience en résultats durables.
          </p>
          <div className="space-y-4">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
              <span className="dark:text-gray-400 text-gray-600">
                Approche holistique et personnalisée
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
              <span className="dark:text-gray-400 text-gray-600">
                Intelligence émotionnelle au cœur du coaching
              </span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-purple-600 mr-3 flex-shrink-0" />
              <span className="dark:text-gray-400 text-gray-600">
                Stratégies concrètes pour des résultats durables
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden max-w-md mx-auto">
            <div className="relative h-[600px] w-full">
              {/* For Next.js, use: */}
              <Image
                src="/images/anxiety.jpg"
                alt="Léopoldine Almeida - Coach de Vie"
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px"
                className="object-cover object-center"
                priority
              />

              {/* Demo placeholder */}
              {/* <img
                src="/api/placeholder/400/600"
                alt="Léopoldine Almeida - Coach de Vie"
                className="w-full h-full object-cover object-center"
              /> */}
            </div>
          </div>

          {/* Quote Card */}
          <div className="mt-6   rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
            <p className="text-gray-700  italic text-lg font-medium mb-3">
              "Les sirènes naissent de la contrainte dont elles s'extraient
              autant que de la liberté qu'elles s'offrent."
            </p>
            <p className="text-sm text-gray-600 ">
              Je crois en la puissance de la pluralité et au réveil de votre
              essence véritable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
