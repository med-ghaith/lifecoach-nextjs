import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { BookingProvider } from "@/context/BookingContext";
import Footer from "@/components/Footer";

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
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
