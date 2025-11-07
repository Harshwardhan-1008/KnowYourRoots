"use client";

import { useEffect, useState } from "react";

export default function ContributionsPage() {
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all contributions from the backend
  const fetchContributions = async () => {
    try {
      const res = await fetch("/api/admin/contributions");
      const data = await res.json();
      setContributions(data || []);
    } catch (err) {
      console.error("Error fetching contributions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  // ✅ Approve contribution (moves data to surnames DB)
  const handleApprove = async (id: string, surname: string, info: string) => {
    const confirm = window.confirm(
      `Approve and publish this contribution for "${surname}"?`
    );
    if (!confirm) return;

    try {
      const res = await fetch("/api/admin/contributions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, surname, info }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Contribution approved!");
        fetchContributions();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("Error approving contribution.");
    }
  };

  // ❌ Delete contribution
  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Are you sure you want to delete this?");
    if (!confirm) return;

    try {
      const res = await fetch("/api/admin/contributions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (data.success) {
        alert("🗑️ Contribution deleted.");
        fetchContributions();
      } else {
        alert("❌ " + data.message);
      }
    } catch (err) {
      alert("Server error.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#800000] text-lg">
        Loading contributions...
      </div>
    );

  return (
    <main className="min-h-screen bg-[#FAF7F0] text-[#333333] px-6 py-10">
      <h1 className="text-4xl font-serif text-[#800000] mb-8 text-center">
        User Contributions
      </h1>

      {contributions.length === 0 ? (
        <p className="text-center text-gray-600">No contributions yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contributions.map((item) => (
            <div
              key={item._id}
              className="bg-white p-6 rounded-lg shadow-md border border-[#C8A951]"
            >
              <h2 className="font-serif text-2xl text-[#800000] capitalize mb-2">
                {item.surname}
              </h2>
              <p className="text-sm text-[#333333] mb-4 whitespace-pre-line">
                {item.info}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                Submitted by: {item.email}
              </p>

              <div className="flex justify-between">
                <button
                  onClick={() =>
                    handleApprove(item._id, item.surname, item.info)
                  }
                  className="bg-[#800000] text-white px-4 py-2 rounded-md hover:bg-[#C8A951] hover:text-[#800000] transition-all"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="bg-gray-300 text-[#800000] px-4 py-2 rounded-md hover:bg-red-400 hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
