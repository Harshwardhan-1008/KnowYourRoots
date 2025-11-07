"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [surname, setSurname] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const router = useRouter();

  // ✅ Debounced fetch (wait 300ms after user stops typing)
  useEffect(() => {
    if (!surname.trim()) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${surname}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [surname]);

  const handleSelect = (value: string) => {
    setSurname(value);
    setSuggestions([]);
    router.push(`/surname/${value.toLowerCase()}`);
  };

  const handleSearch = () => {
    if (!surname.trim()) return;
    router.push(`/surname/${surname.toLowerCase()}`);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto z-999">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter your surname..."
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="px-5 py-3 w-full rounded-md border-2 border-[#C8A951]
                     bg-[#ffffffc7] text-[#333] outline-none"
        />

        <button
          onClick={handleSearch}
          className="bg-[#800000] text-white px-6 py-3 rounded-md hover:bg-[#C8A951] hover:text-[#800000]"
        >
          Discover
        </button>
      </div>

      {/* ✅ Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute w-full mt-2 bg-[#FFF9E6] border border-[#C8A951] shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
          {suggestions.map((item: any, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(item.surname)}
              className="px-4 py-2 cursor-pointer hover:bg-[#C8A951] hover:text-[#4A1A0A]"
            >
              {item.surname}
            </li>
          ))}
        </ul>
      )}

      {/* ✅ No results found (fixed placement) */}
      {surname.trim() !== "" && suggestions.length === 0 && (
        <p className="text-xs text-[#C8A951] mt-2 text-center italic">
          No matching surname found.
        </p>
      )}
    </div>
  );
}
