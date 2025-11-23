"use client";

import { useState, FormEvent } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { sendEmail } from "@/lib/email";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.message) return;
    const html = `
    <h2>New Contact Message</h2>
    <p><strong>Name:</strong> ${formData.name}</p>
    <p><strong>Email:</strong> ${formData.email}</p>
    <p><strong>Phone:</strong> ${formData.phone || "N/A"}</p>
    <p><strong>Message:</strong></p>
    <p>${formData.message}</p>
  `;

    const result = await sendEmail({
      to: formData.email, // or your admin email
      subject: "New Contact Message",
      html,
    });

    if (result?.success) {
      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({ name: "", email: "", message: "", phone: "" });
      }, 2000);
    } else {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    }
    await fetch("/api/send-whatsapp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
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
          className="mt-2 w-full rounded-lg border focus:outline-none border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
          className="mt-2 w-full rounded-lg border focus:outline-none border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
          className="mt-2 w-full rounded-lg border focus:outline-none border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-purple-600 focus:border-transparent"
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
          className="mt-2 w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
          placeholder="Votre message..."
        />
      </div>

      {/* Submit Section */}
      <div className="flex items-center gap-4 ">
        <button
          type="submit"
          disabled={!isFormValid}
          className={`px-6 py-3 rounded-lg font-semibold transition cursor-pointer  ${
            isFormValid
              ? "bg-purple-600 text-white hover:bg-purple-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          Envoyer le message
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
          href="mailto:contact@leopoldine-almeida.com"
          className="text-purple-600 font-medium hover:text-purple-700"
        >
          contact@leopoldine-almeida.com
        </a>
      </div>
    </form>
  );
}
