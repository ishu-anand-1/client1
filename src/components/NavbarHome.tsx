// pages/home/page.tsx OR app/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        setMessage("✅ Registered successfully! You can now login.");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(`❌ ${data.error || "Registration failed"}`);
      }
    } catch (err) {
      setLoading(false);
      setMessage("❌ Something went wrong. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-black text-gray-800 dark:text-white flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row items-center justify-around gap-10 max-w-7xl w-full">
        {/* Welcome Section */}
        <div className="max-w-lg text-center md:text-left space-y-4">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Welcome to Invoice Generator
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Create professional invoices in minutes. Boost your brand and
            billing process with our customizable, industry-specific templates.
          </p>
          <Link href="/invoicepage">
            <button className="mt-4 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition">
              Get Started
            </button>
          </Link>
        </div>

        {/* Register Box */}
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

          {message && (
            <div
              className={`mb-4 text-center ${
                message.startsWith("✅") ? "text-green-600" : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold ${
                loading
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
