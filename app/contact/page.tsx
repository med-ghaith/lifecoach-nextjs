import ContactForm from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen  py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold">Contact</h1>

        <p className="mt-4 text-lg text-gray-400">
          Envoyez-moi un message et je vous répondrai dans les 48 heures.
        </p>
      </div>

      <div className="max-w-3xl mx-auto mt-10 bg-white  shadow-xl rounded-2xl p-8 border border-gray-100">
        <ContactForm />
      </div>
    </div>
  );
}
