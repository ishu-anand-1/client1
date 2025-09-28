"use client";

import "./globals.css";
import { ShopProvider } from "@/app/context/ShopContext";
import Navbar from "@/app/components/Navbar";
import { usePathname } from "next/navigation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noNavbarPages = ["/", "/login", "/register"];
  const showNavbar = !noNavbarPages.includes(pathname);

  return (
    <html lang="en">
      <body>
        <ShopProvider>
          {showNavbar && <Navbar />}
          <main>{children}</main>
        </ShopProvider>
      </body>
    </html>
  );
}
