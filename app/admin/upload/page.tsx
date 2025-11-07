"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState<"upload" | "preview" | "done">("upload");
  const [message, setMessage] = useState("");

  const handlePreview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a CSV file.");
    setLoading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/preview", { method: "POST", body: formData });
    const data = await res.json();

    if (data.success) {
      setPreview(data.preview);
      setStage("preview");
      setMessage(`Previewing ${data.preview.length} of ${data.total} rows.`);
    } else {
      setMessage("❌ " + data.error);
    }
    setLoading(false);
  };

  const handleCommit = async () => {
    setLoading(true);
    setMessage("");
    const validRows = preview.filter((r) => r.status === "valid");
    const res = await fetch("/api/admin/commit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows: validRows }),
    });
    const data = await res.json();
    setLoading(false);
    setStage("done");
    setMessage(`✅ Inserted ${data.inserted} surnames successfully.`);
  };

  return (
    <main className="min-h-screen bg-[#FAF7F0] flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-serif text-[#800000] mb-6">Bulk Import Surnames</h1>

      {stage === "upload" && (
        <form onSubmit={handlePreview} className="bg-white p-6 rounded-xl shadow-md w-96 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border border-[#C8A951] rounded p-2 w-full mb-4"
          />
          <button
            disabled={loading}
            className="bg-[#800000] text-white w-full py-2 rounded hover:bg-[#C8A951] hover:text-[#800000] transition-all"
          >
            {loading ? "Analyzing..." : "Preview Import"}
          </button>
          {message && <p className="mt-4 text-sm text-[#800000]">{message}</p>}
        </form>
      )}

      {stage === "preview" && (
        <section className="bg-white p-6 rounded-xl shadow-md max-w-5xl overflow-x-auto">
          <p className="mb-4 text-[#333]">{message}</p>
          <table className="table-auto border-collapse w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7F0] text-[#800000]">
                <th className="border p-2">Surname</th>
                <th className="border p-2">Region</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Warnings</th>
              </tr>
            </thead>
            <tbody>
              {preview.map((r, i) => (
                <motion.tr
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-b"
                >
                  <td className="border p-2">{r.surname}</td>
                  <td className="border p-2">{r.region}</td>
                  <td className={`border p-2 ${r.status === "valid" ? "text-green-700" : "text-red-600"}`}>
                    {r.status}
                  </td>
                  <td className="border p-2 text-xs text-gray-600">{r.warnings?.join(", ")}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleCommit}
            className="mt-6 bg-[#800000] text-white px-8 py-2 rounded hover:bg-[#C8A951] hover:text-[#800000]"
          >
            Commit Import
          </button>
        </section>
      )}

      {stage === "done" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mt-10"
        >
          <h2 className="text-2xl text-[#800000]">{message}</h2>
        </motion.div>
      )}
    </main>
  );
}
