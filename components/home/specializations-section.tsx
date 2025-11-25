import { Heart, Users, TrendingUp, Scale, Shield } from "lucide-react";
import Image from "next/image";

const specializations = [
  {
    icon: Heart,
    title: "Vie Sentimentale",
    image: "/images/romantic-life.jpeg",
    description:
      "Aspirez-vous à une vie sentimentale épanouie et pleine de sens ? Le chemin vers l'amour véritable commence par la relation la plus importante : celle que vous entretenez avec vous-même. Ensemble, nous travaillerons à redéfinir vos attentes, à améliorer votre communication et à vous doter des outils essentiels pour non seulement trouver le partenaire idéal, mais surtout, pour devenir la meilleure version de vous-même dans l'aventure de l'amour.",
  },
  {
    icon: Users,
    title: "Vie Familiale",
    image: "/images/family-life.jpeg",
    description:
      "Les relations familiales sont le pilier de notre épanouissement, mais elles peuvent aussi être source de défis. Je suis là pour vous aider à restaurer l'harmonie, la paix et une connexion profonde au sein de votre foyer. Nous explorerons ensemble des stratégies de communication bienveillantes et cultiverons un environnement familial où chaque membre se sent écouté, valorisé et aimé.",
  },
  {
    icon: TrendingUp,
    title: "Vie Financière et Professionnelle",
    image: "/images/career-finance.jpeg",
    description:
      "Stagnez-vous dans un emploi qui ne vous inspire plus, ou luttez-vous pour atteindre la sécurité financière que vous méritez ? Je vous offre un partenariat stratégique pour débloquer votre plein potentiel. Nous travaillerons ensemble pour clarifier vos objectifs de carrière, développer une stratégie financière solide et créer une vie professionnelle épanouissante et financièrement stable.",
  },
  {
    icon: Scale,
    title: "Perte de Poids",
    image: "/images/weight-loss.jpeg",
    description:
      "Fatigué des régimes yo-yo et des solutions miracles qui ne durent jamais ? Mon approche dépasse la simple perte de chiffres sur la balance. Je vous propose un accompagnement personnalisé et holistique pour transformer durablement votre relation à la nourriture, à votre corps et à l'exercice physique. Redécouvrez le plaisir de vivre dans un corps sain et dynamique.",
  },
  {
    icon: Shield,
    title: "Gestion de l'Anxiété",
    image: "/images/anxiety-management.jpeg",
    description:
      "Vous n'êtes pas votre anxiété ; vous êtes la personne courageuse qui la traverse. Le poids constant de l'angoisse peut rendre chaque jour difficile. Mon rôle est de vous fournir un espace sécurisé et des stratégies concrètes pour vous aider à reprendre le contrôle de votre système nerveux et de vos pensées. Ensemble, nous pouvons transformer ces schémas de peur en mécanismes d'adaptation résilients.",
  },
];

export default function SpecializationsSection() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Mes Domaines d'Accompagnement
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Un accompagnement personnalisé pour chaque aspect de votre vie
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {specializations.map((spec, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <Image
                src={spec.image}
                alt={spec.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Icon overlay */}
              <div className="absolute bottom-4 left-4 bg-white rounded-full p-3 shadow-lg">
                <spec.icon className="h-6 w-6 text-purple-600" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {spec.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                {spec.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="relative w-full h-72 md:h-96 mt-16 rounded-2xl overflow-hidden shadow-lg">
        <Image
          src="/images/eq.jpeg"
          alt="Intelligence Émotionnelle"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="mt-16 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Intelligence Émotionnelle
        </h3>
        <p className="text-gray-600 mb-6 text-center max-w-3xl mx-auto">
          L'intelligence émotionnelle (IE) désigne la capacité à reconnaître,
          comprendre, exprimer et gérer ses propres émotions, ainsi qu'à
          comprendre et influencer les émotions des autres.
        </p>
        <div className="grid md:grid-cols-5 gap-4">
          {[
            {
              title: "Conscience de soi",
              desc: "Identifier ce que l'on ressent",
            },
            { title: "Maîtrise de soi", desc: "Réguler ses émotions" },
            { title: "Motivation", desc: "Rester orienté vers ses objectifs" },
            { title: "Empathie", desc: "Comprendre les émotions des autres" },
            {
              title: "Compétences sociales",
              desc: "Créer de bonnes relations",
            },
          ].map((pillar, idx) => (
            <div key={idx} className="bg-white rounded-lg p-4 text-center">
              <div className="text-purple-600 font-bold text-lg mb-2">
                {pillar.title}
              </div>
              <p className="text-sm text-gray-600">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
