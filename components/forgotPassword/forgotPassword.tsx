"use client";
import React, { useState } from "react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { render } from "@react-email/render";
import { sendEmail } from "@/lib/email";
import { ForgotPasswordEmail } from "../emailTemplates/ForgotPasswordEmail";

export default function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const handleBackToLogin = () => {
    setIsSubmitted(false);
    setEmail("");
    router.push("/admin/login");
  };
 const handleSubmit = async () => {
   if (!email) return;

   setIsLoading(true);
   setError("");

   try {
     const baseUrl = `${process.env.NEXT_PUBLIC_WEB_DNS!}/admin/reset-password`;
     const ownerHtml = render(
       <ForgotPasswordEmail
         resetUrl={`${baseUrl}?email=${encodeURIComponent(email)}`}
       />
     );

     const emailSendToOwner = await sendEmail({
       to: email,
       subject: "Réinitialisation du mot de passe",
       html: await ownerHtml,
     });

     if (emailSendToOwner?.success) {
       setIsSubmitted(true); // show success message
     } else {
       setError("Une erreur s'est produite. Veuillez réessayer.");
     }
   } catch (err) {
     console.error(err);
     setError("Une erreur s'est produite. Veuillez réessayer.");
   } finally {
     setIsLoading(false);
   }
 };


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {!isSubmitted ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-100">
            {/* Back Button */}
            <button
              onClick={handleBackToLogin}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium" onClick={handleBackToLogin}>
                Retour à la connexion
              </span>
            </button>

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Mot de passe oublié ?
              </h2>
              <p className="text-gray-600">
                Pas de souci ! Entrez votre adresse e-mail et nous vous
                enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            <div className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400 transition"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !email}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/30"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : (
                  "Envoyer le lien de réinitialisation"
                )}
              </button>
            </div>
          </div>
        ) : (
          // Success State
          <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-gray-100 text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              E-mail envoyé !
            </h2>
            <p className="text-gray-600 mb-2">
              Nous avons envoyé un lien de réinitialisation à :
            </p>
            <p className="text-purple-600 font-semibold mb-6">{email}</p>
            <p className="text-sm text-gray-500 mb-8">
              Vérifiez votre boîte de réception et suivez les instructions pour
              réinitialiser votre mot de passe. Le lien expirera dans 24 heures.
            </p>

            <button
              onClick={handleBackToLogin}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/30"
            >
              Retour à la connexion
            </button>

      
          </div>
        )}
      </div>
    </div>
  );
}
