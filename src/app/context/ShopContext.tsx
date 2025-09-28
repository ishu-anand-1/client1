"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

type ShopContextType = {
  shopName: string;
  shopLogo: string | null;
  setShopName: (name: string) => void;
  setShopLogo: (logo: string | null) => void;
};

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: ReactNode }) {
  const [shopName, setShopName] = useState("Shop");
  const [shopLogo, setShopLogo] = useState<string | null>(null);

  return (
    <ShopContext.Provider value={{ shopName, shopLogo, setShopName, setShopLogo }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}
