"use client";
import { motion } from "framer-motion";

export default function SurnameClientPage({ surname }: { surname: any }) {
  return (
    <main className="relative min-h-screen text-[#FAF7F0] overflow-hidden">
      {/* 🎥 Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-[0.45] contrast-[1.1] saturate-[1.05] -z-20"
      >
        <source src="/videos/cinematic-heritage.mp4" type="video/mp4" />
      </video>

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A0E05]/70 via-[#3A240E]/60 to-[#FAF7F0]/30 mix-blend-multiply -z-10"></div>

      {/* 🌟 Hero Section */}
      <section className="relative z-10 flex flex-col justify-center items-center min-h-[60vh] text-center px-6">
        <motion.h1
          className="font-serif text-6xl sm:text-7xl text-[#E6C77B] mb-4 drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {surname.surname}
        </motion.h1>
        <motion.p
          className="font-sans text-lg text-[#FFF3C0] italic max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {surname.shortSummary}
        </motion.p>
      </section>

      {/* 📜 Content Section */}
      <motion.section
        className="relative z-10 bg-[#FFF8E1]/90 text-[#2B1B0F] max-w-4xl mx-auto my-16 p-10 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.3)] backdrop-blur-sm"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-serif text-3xl text-[#800000] mb-6 border-b-2 border-[#C8A951] inline-block">
          Detailed Origin & History
        </h2>
        <p className="font-sans text-lg leading-relaxed whitespace-pre-line mb-6">
          {surname.description}
        </p>

        {surname.origin && (
          <div className="mt-8">
            <h3 className="font-serif text-2xl text-[#800000] mb-2">Origin</h3>
            <p className="font-sans text-base">{surname.origin}</p>
          </div>
        )}
      </motion.section>

      {/* 🌿 Decorative Footer */}
      <footer className="relative z-10 text-center py-10 text-[#C8A951] text-sm">
        © 2025 KnowYourRoots — Preserving Cultural Heritage
      </footer>
    </main>
  );
}
