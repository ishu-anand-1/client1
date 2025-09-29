"use client";

import Link from "next/link";
import { useState } from "react";
import { useShop } from "@/app/context/ShopContext";

export default function Navbar() {
  const { shopName, shopLogo } = useShop();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/invoice", label: "Create Invoice" },
    { href: "/products", label: "Product Listing" },
    { href: "/history", label: "History" },
    { href: "/settings", label: "Settings" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand Section */}
       <Link href="/invoice" className="flex items-center gap-3 cursor-pointer">
      {shopLogo && (
        <img
          src={shopLogo}
          alt="Shop Logo"
          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
        />
      )}
      <span className="text-white font-extrabold text-xl tracking-wide drop-shadow-sm">
        {shopName || "Shop"}
      </span>
    </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-white font-medium text-sm md:text-base relative group"
            >
              {label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-white transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <img
              src="/Hamburger_icon.svg.png" // <-- place this image in the public folder
              alt="Menu"
              className="w-8 h-8"
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 space-y-3">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-white font-medium text-base"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
