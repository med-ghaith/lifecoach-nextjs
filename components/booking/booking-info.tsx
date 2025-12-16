import { Mail, Phone } from "lucide-react";

export default function BookingInfo() {
  return (
    <div>
      <div className="bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold mb-3 text-black">Informations</h4>
        <p className="text-sm text-gray-600 mb-4">
          Les séances durent 15 minutes. Choisissez une date puis une heure et
          appuyez sur "Réserver". Vous recevrez une confirmation ici. Pour le
          paiement et la confirmation finale, nous vous contacterons par email.
        </p>
        <p className="text-sm text-purple-600 font-medium mb-4">
          ✨ Première séance de 15 min gratuite
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-purple-600" />
            <a
              className="text-sm text-gray-700 hover:text-purple-600"
              href="mailto:Support@leopoldinealmeida.com"
            >
              Support@leopoldinealmeida.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-purple-600" />
            <a
              className="text-sm text-gray-700 hover:text-purple-600"
              href="tel:+33123456789"
            >
              +33 0 758 230 354
            </a>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h4 className="font-semibold mb-3 text-black">Comment ça marche</h4>
        <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
          <li>Choisissez une date</li>
          <li>Sélectionnez une heure</li>
          <li>
            Réservez (nous vous contacterons par email pour confirmer et traiter
            le paiement)
          </li>
        </ol>
      </div>
    </div>
  );
}
