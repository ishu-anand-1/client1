"use client";

import Link from "next/link";
import { useShop } from "@/app/context/ShopContext";

export default function Navbar() {
  const { shopName, shopLogo } = useShop();

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Brand Section */}
        <div className="flex items-center gap-3">
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
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {[
            { href: "/invoice", label: "Create Invoice" },
            { href: "/history", label: "History" },
            { href: "/settings", label: "Settings" },
          ].map(({ href, label }) => (
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
      </div>
    </nav>
  );
}
