"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Surname {
  _id?: string;
  key: string;
  surname: string;
  origin: string;
  meaning: string;
  region: string;
}

export default function AdminDashboard() {
  const [surnames, setSurnames] = useState<Surname[]>([]);
  const [form, setForm] = useState<Surname>({
    key: "",
    surname: "",
    origin: "",
    meaning: "",
    region: "",
  });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch all surnames
  const fetchSurnames = async () => {
    const res = await fetch("/api/surnames");
    const data = await res.json();
    setSurnames(data);
  };

  useEffect(() => {
    fetchSurnames();
  }, []);

  // Add / Update surname
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/surnames?id=${editingId}` : "/api/surnames";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ key: "", surname: "", origin: "", meaning: "", region: "" });
      setEditingId(null);
      fetchSurnames();
    }

    setLoading(false);
  };

  // Delete surname
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this surname?")) return;
    await fetch(`/api/surnames?id=${id}`, { method: "DELETE" });
    fetchSurnames();
  };

  // Edit surname
  const handleEdit = (item: Surname) => {
    setForm(item);
    setEditingId(item._id || null);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-md border border-[#C8A951]"
      >
        <h1 className="font-serif text-4xl text-[#800000] text-center mb-8">
          Admin Dashboard
        </h1>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
        >
          <input
            placeholder="Surname Key (lowercase)"
            value={form.key}
            onChange={(e) => setForm({ ...form, key: e.target.value })}
            className="border p-3 rounded-md border-[#C8A951]"
            required
          />
          <input
            placeholder="Surname Display Name"
            value={form.surname}
            onChange={(e) => setForm({ ...form, surname: e.target.value })}
            className="border p-3 rounded-md border-[#C8A951]"
            required
          />
          <input
            placeholder="Origin"
            value={form.origin}
            onChange={(e) => setForm({ ...form, origin: e.target.value })}
            className="border p-3 rounded-md border-[#C8A951]"
          />
          <input
            placeholder="Region / Place"
            value={form.region}
            onChange={(e) => setForm({ ...form, region: e.target.value })}
            className="border p-3 rounded-md border-[#C8A951]"
          />
          <textarea
            placeholder="Meaning / Description"
            value={form.meaning}
            onChange={(e) => setForm({ ...form, meaning: e.target.value })}
            className="border p-3 rounded-md border-[#C8A951] col-span-1 md:col-span-2"
            rows={3}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#800000] text-white py-3 rounded-md col-span-1 md:col-span-2 hover:bg-[#C8A951] hover:text-[#800000] transition-all"
          >
            {editingId ? "Update Surname" : loading ? "Saving..." : "Add Surname"}
          </button>
        </form>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[#C8A951] text-[#800000]">
                <th className="p-2 border">Surname</th>
                <th className="p-2 border">Origin</th>
                <th className="p-2 border">Region</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {surnames.map((item) => (
                <tr key={item._id} className="text-center border">
                  <td className="p-2 border">{item.surname}</td>
                  <td className="p-2 border">{item.origin}</td>
                  <td className="p-2 border">{item.region}</td>
                  <td className="p-2 border space-x-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-3 py-1 bg-[#C8A951] text-[#800000] rounded-md hover:opacity-80"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id!)}
                      className="px-3 py-1 bg-[#800000] text-white rounded-md hover:bg-[#C8A951] hover:text-[#800000]"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </main>
  );
}
