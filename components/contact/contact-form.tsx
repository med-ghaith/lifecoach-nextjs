"use client";

import { useState, FormEvent } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { sendEmail } from "@/lib/email";
import { render } from "@react-email/render";
import { OwnerEmail } from "../emailTemplates/OwnerEmail";
import { ClientEmail } from "../emailTemplates/ClientEmail";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.message) return;

    try {
      setIsLoading(true);

      const clientHtml = render(<ClientEmail name={formData.name} />);

      const ownerHtml = render(
        <OwnerEmail
          name={formData.name}
          email={formData.email}
          phone={formData.phone}
          message={formData.message}
          dashboardUrl={`${process.env.NEXT_PUBLIC_WEB_DNS!}/admin/dashboard`}
        />
      );
      const emailSendToOwner = await sendEmail({
        to: `${process.env.NEXT_PUBLIC_EMAIL_USER!}`,
        subject: "New Contact Message",
        html: await ownerHtml,
      });

      const emailSentToUser = await sendEmail({
        to: formData.email,
        subject:
          "Transformez Votre Avenir grâce à une Consultation Miraculeuse",
        html: await clientHtml,
      });

      if (emailSentToUser?.success && emailSendToOwner?.success) {
        setFormSubmitted(true);
        setFormData({ name: "", email: "", message: "", phone: "" });
      } else {
        setError("Une erreur s'est produite. Veuillez réessayer.");
      }
    } catch {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Nom</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-2 w-full rounded-lg border text-gray-700  focus:outline-none border-gray-300 placeholder-gray-400 p-3 shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          placeholder="Votre nom"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-2 w-full rounded-lg border text-gray-700 focus:outline-none border-gray-300 placeholder-gray-400 p-3 shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          placeholder="votre@email.com"
        />
      </div>
      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => {
            // Allow only digits and plus sign
            const sanitized = e.target.value.replace(/[^0-9+]/g, "");
            setFormData({ ...formData, phone: sanitized });
          }}
          className="mt-2 w-full rounded-lg border text-gray-700 focus:outline-none border-gray-300 placeholder-gray-400 p-3 shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          placeholder="+33 6 12 34 56 78"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          rows={5}
          value={formData.message}
          onChange={(e) =>
            setFormData({ ...formData, message: e.target.value })
          }
          className="mt-2 w-full rounded-lg border text-gray-700 border-gray-300 placeholder-gray-400 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          placeholder="Votre message..."
        />
      </div>

      {/* Submit Section */}
      <div className="flex items-center gap-4 ">
        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
            isFormValid && !isLoading
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {isLoading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Envoi en cours...
            </>
          ) : (
            "Envoyer le message"
          )}
        </button>

        {formSubmitted && (
          <div className="inline-flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Message envoyé !</span>
          </div>
        )}
        {error && (
          <div className="inline-flex items-center gap-2 text-red-600">
            <XCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Direct Email */}
      <div className="pt-4 text-sm text-gray-500">
        Ou écrivez directement à :{" "}
        <a
          href="mailto:Support@leopoldinealmeida.com"
          className="text-purple-600 font-medium hover:text-purple-700"
        >
          Support@leopoldinealmeida.com
        </a>
      </div>
    </form>
  );
}
