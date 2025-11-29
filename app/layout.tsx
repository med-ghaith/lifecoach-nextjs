import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { BookingProvider } from "@/context/BookingContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Léopoldine Almeida - Coach de Vie",
  description:
    "Coach de vie spécialisée dans l'accompagnement pour retrouver clarté, confiance et équilibre",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <BookingProvider>
            <Navigation />

            <main>{children}</main>
          </BookingProvider>
          <footer className="bg-gray-100 dark:bg-gray-900 mt-12 py-8 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Léopoldine Almeida — Coach de Vie
              Professionnelle •{" "}
              <a
                href="mailto:contact@leopoldine-almeida.com"
                className="text-purple-600 dark:text-purple-400 hover:underline"
              >
                Contact
              </a>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
