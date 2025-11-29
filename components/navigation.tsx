"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useBooking } from "@/context/BookingContext";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setMaxSessions, setSelectedPackage } = useBooking();

  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/booking", label: "Réserver" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  // Reset context when leaving /booking page
  const handleNavClick = (href: string) => {
    // If currently on /booking and navigating away from it, reset values
    if (pathname === "/booking" && href !== "/booking") {
      setMaxSessions(1);
      setSelectedPackage(null);
    }
    // Close mobile menu
    setMobileMenuOpen(false);
  };
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => handleNavClick("/")}
            className="flex items-center"
          >
            <Heart className="h-8 w-8 text-purple-600" />
            <span className="ml-2 text-2xl font-bold text-gray-800 dark:text-white">
              Léopoldine Almeida
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => handleNavClick(link.href)}
                className={`${
                  isActive(link.href)
                    ? "text-purple-600 dark:text-purple-400"
                    : "text-gray-600 dark:text-gray-300"
                } hover:text-purple-600 dark:hover:text-purple-400 transition`}
              >
                {link.label}
              </Link>
            ))}
            {/* Theme Toggle */}
            <div className="ml-4">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <ThemeToggle />
            <button
              className="ml-2 text-gray-800 dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 transition-colors">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  handleNavClick(link.href);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left py-2 text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
