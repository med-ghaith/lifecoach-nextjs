import { Mail, Phone, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className=" mt-12 py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <a
              href="mailto:Support@leopoldinealmeida.com"
              className="flex items-center  hover:text-purple-600  transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a
              href="https://wa.me/+330758230354"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center  hover:text-green-600  transition-colors"
              aria-label="WhatsApp"
            >
              <Phone className="h-5 w-5" />
            </a>
            <a
              href="https://facebook.com/leopoldinealmeida"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center  hover:text-blue-600  transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm ">
            © {new Date().getFullYear()} Léopoldine Almeida — Coach de Vie
            Professionnelle
          </div>
        </div>
      </div>
    </footer>
  );
}
