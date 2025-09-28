"use client";
import { useShop } from "@/app/context/ShopContext";
import { useState } from "react";

export default function SettingsPage() {
  const { setShopName, setShopLogo } = useShop();
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const handleSave = () => {
    if (name) setShopName(name);
    if (logo) {
      const reader = new FileReader();
      reader.onload = () => {
        setShopLogo(reader.result as string);
        alert("Saved successfully!");
      };
      reader.readAsDataURL(logo);
    } else {
      alert("Saved successfully!");
    }
  };

   return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Shop Settings
        </h2>

        {/* Shop Name */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shop Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your shop name"
          className="w-full rounded-lg border border-gray-300 p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />

        {/* Shop Logo */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Shop Logo
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogo(e.target.files?.[0] || null)}
          className="w-full rounded-lg border border-gray-300 p-3 mb-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
