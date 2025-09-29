"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
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
      if (res.ok) {
        setMessage("✅ Registered successfully! You can now login.");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(`❌ ${data.error || "Registration failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGetStarted() {
    router.push("/invoice");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white">
      {/* Floating gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-bounce delay-1000" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply blur-3xl opacity-40 animate-pulse delay-2000" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:40px_40px]" />
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-16 px-6 py-20 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="max-w-xl text-center md:text-left space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight drop-shadow-xl">
            Craft{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-400 animate-gradient-x">
              Stunning Invoices
            </span>
            <br /> in Minutes
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Boost your business with professional, customizable invoice
            templates and instant PDF export.
          </p>

          <button
            onClick={handleGetStarted}
            type="button"
            className="mt-6 px-10 py-4 rounded-full font-semibold shadow-2xl bg-gradient-to-r from-pink-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 transition-transform transform hover:scale-110 focus:ring-4 focus:ring-pink-300"
          >
            🚀 Get Started
          </button>
        </div>

        {/* Registration Card */}
        <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/10 backdrop-blur-2xl p-8 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
          <h2 className="text-3xl font-bold mb-6 text-center tracking-wide">
            Join Us
          </h2>

          {message && (
            <div
              className={`mb-4 text-center font-medium ${
                message.startsWith("✅") ? "text-green-300" : "text-red-300"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold shadow-lg transition-transform ${
                loading
                  ? "bg-pink-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-500 to-indigo-500 hover:scale-105 hover:from-pink-600 hover:to-indigo-600"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/80">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-300 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
