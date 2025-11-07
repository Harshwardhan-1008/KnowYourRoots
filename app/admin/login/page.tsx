"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      router.push("/admin/dashboard");
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#FAF7F0] px-4">
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl border border-[#C8A951] w-full max-w-sm text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-3xl text-[#800000] mb-4">
          Admin Login
        </h1>
        <p className="text-sm text-[#C8A951] mb-6">
          Enter your credentials to access dashboard
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-[#C8A951] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#800000]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-[#C8A951] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#800000]"
            required
          />
          {error && <p className="text-[#800000] text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-[#800000] text-white font-sans py-3 rounded-md hover:bg-[#C8A951] hover:text-[#800000] transition-all"
          >
            Log In
          </button>
        </form>
      </motion.div>
    </main>
  );
}
