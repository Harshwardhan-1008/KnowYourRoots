// components/LoadingSpinner.tsx
"use client";
import { motion } from "framer-motion";

export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 rounded-full border-4 border-t-[#800000] border-r-transparent border-b-[#C8A951] border-l-transparent"
      />
      <p className="mt-3 font-sans text-sm text-[#333333]">{text}</p>
    </div>
  );
}
