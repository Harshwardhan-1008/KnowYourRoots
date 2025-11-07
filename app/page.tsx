"use client";
import Head from "next/head";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [surname, setSurname] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);             // ✅ Moved here
  const [donationOpen, setDonationOpen] = useState(false); // ✅ Moved here
  const router = useRouter();

useEffect(() => {
  const timer = setTimeout(() => {
    setDonationOpen(true);
  }, 7000); // 7 seconds delay

  return () => clearTimeout(timer);
}, []);


  const handleSearch = () => {
    const cleanSurname = surname.trim().toLowerCase();
    if (!cleanSurname) return;
    setLoading(true);
    router.push(`/surname/${encodeURIComponent(cleanSurname)}`);
    setLoading(false);
  };
  const startRazorpayPayment = (amount: number) => {
  const options = {
    key: "YOUR_RAZORPAY_KEY_ID", // Replace with your Key ID from Razorpay Dashboard
    amount: amount * 100, // Razorpay accepts in paise
    currency: "INR",
    name: "KnowYourRoots",
    description: "Support Surname Research",
    image: "/logo.png",
    handler: function () {
      alert("Thank you for your support ❤️");
    },
    prefill: {
      name: "",
      email: "",
      contact: "",
    },
    theme: {
      color: "#800000",
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
  return (
    <>
      {/* ✅ SEO HEAD */}
      <Head>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <title>KnowYourRoots — Discover Your Surname Meaning & Legacy</title>
        <meta
          name="description"
          content="Discover the origin, culture, and history behind your surname. Learn what your family name truly means and uncover your ancestral legacy."
        />
        <meta
          name="keywords"
          content="surname meaning, surname origin, family name history, ancestry, heritage, KnowYourRoots"
        />
        <meta name="robots" content="index, follow" />
      </Head>

      <main className="relative min-h-screen flex flex-col items-center text-[#FAF7F0] overflow-x-hidden">
  {/* ✅ ADD NAVBAR HERE */}
<nav className="fixed top-0 w-full bg-black/40 backdrop-blur-md border-b border-[#C8A951]/40 z-50 px-6 py-4 flex justify-between items-center">

  <h1 className="text-2xl font-serif text-[#E6C77B]">KnowYourRoots</h1>

  {/* Desktop Menu */}
  <div className="hidden md:flex gap-6">
    <button onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })} className="text-[#FAF7F0] hover:text-[#C8A951]">Search</button>
    <button onClick={() => document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })} className="text-[#FAF7F0] hover:text-[#C8A951]">Featured</button>
    <button onClick={() => document.getElementById("why-this-matters")?.scrollIntoView({ behavior: "smooth" })} className="text-[#FAF7F0] hover:text-[#C8A951]">About</button>
    <button 
      onClick={() => setDonationOpen(true)}
      className="bg-[#C8A951] text-[#4A1A0A] px-4 py-1 rounded-md font-medium hover:bg-[#FAF7F0] transition">
      Support
    </button>
  </div>

  {/* Mobile Menu Button */}
  <button className="md:hidden text-[#FAF7F0]" onClick={() => setOpen(!open)}>
    ☰
  </button>

  {/* Mobile Menu */}
  {open && (
    <div className="absolute top-16 left-0 w-full bg-black/80 flex flex-col gap-4 p-4 md:hidden">
      <button onClick={() => { document.getElementById("search")?.scrollIntoView({ behavior: "smooth" }); setOpen(false); }} className="text-[#FAF7F0]">Search</button>
      <button onClick={() => { document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" }); setOpen(false); }} className="text-[#FAF7F0]">Featured</button>
      <button onClick={() => { document.getElementById("why-this-matters")?.scrollIntoView({ behavior: "smooth" }); setOpen(false); }} className="text-[#FAF7F0]">About</button>
      <button 
        onClick={() => { setDonationOpen(true); setOpen(false); }}
        className="bg-[#C8A951] text-[#4A1A0A] px-4 py-2 rounded-md font-medium">
        Support
      </button>
    </div>
  )}
</nav>
        {/* 🎥 HERO SECTION */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Background Video */}
          <video
          id="search"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover brightness-[0.45] contrast-[1.15] -z-10"
          >
            <source src="/videos/cinematic-heritage.mp4" type="video/mp4" />
          </video>

          {/* Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-[#1a0e00]/70 -z-5" />

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3 }}
            className="relative z-10 px-6"
          >
            <h1 className="font-serif text-6xl sm:text-5xl mb-6 drop-shadow-2xl">
              Know Your Roots
            </h1>
            <p className="font-sans text-lg sm:text-base text-[#C8A951] italic mb-10">
              "Where culture meets your legacy."
            </p>

            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <input
                type="text"
                placeholder="Enter your surname..."
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="px-5 py-3 w-72 sm:w-80 rounded-md border-2 border-[#C8A951] bg-[#ffffffb0] text-[#333] outline-none focus:ring-2 focus:ring-[#C8A951]"
              />
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#800000] text-white font-sans px-6 py-3 rounded-md hover:bg-[#C8A951] hover:text-[#800000] transition-all disabled:opacity-60"
              >
                {loading ? "Searching..." : "Discover"}
              </button>
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-10 text-sm text-[#C8A951] italic tracking-widest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: 1 }}
          >
            Scroll ↓
          </motion.div>
        </section>

        {/* 🌿 HOW IT WORKS */}
        <motion.section
          className="relative py-28 text-center text-[#FAF7F0] w-full overflow-hidden bg-transparent"
          id="how-it-works"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          viewport={{ once: true }}
        >
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/Cream Brown Vintage History Project Presentation.jpg"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.55] contrast-[1.15] saturate-[1.1] -z-20"
          >
            <source src="/videos/cinematic-heritage.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-b from-[#1A0E05]/70 via-[#3A240E]/50 to-[#FAF7F0]/40 mix-blend-multiply -z-10"></div>

          <h2 className="font-serif text-5xl text-[#E6C77B] mb-16 tracking-wide drop-shadow-[0_3px_8px_rgba(0,0,0,0.7)]">
            How It Works
          </h2>
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
            {[
              { icon: "🔍", title: "Search", text: "Enter your surname to begin your journey." },
              { icon: "📜", title: "Discover", text: "Learn the meaning and origin behind your name." },
              { icon: "🌳", title: "Understand", text: "Reconnect with your ancestral story and culture." },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="bg-[#FFF8E1]/80 backdrop-blur-[2px] border border-[#C8A951]/60 rounded-2xl p-10 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.35)] hover:-translate-y-2 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
              >
                <div className="text-6xl mb-6 drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]">{step.icon}</div>
                <h3 className="font-serif text-3xl text-[#D8AF5F] mb-3 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
                  {step.title}
                </h3>
                <p className="font-sans text-base text-[#2B1B0F]/90 leading-relaxed">
                  {step.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* 🌟 FEATURED SURNAMES */}
        <motion.section
          className="relative py-28 text-center w-full overflow-hidden bg-transparent"
          id="featured-surnames"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/Cream Brown Vintage History Project Presentation.jpg"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.55] contrast-[1.15] saturate-[1.1] -z-20"
          >
            <source src="/videos/cinematic-heritage.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-b from-[#2B1B0F]/75 via-[#1A0E05]/60 to-[#FAF7F0]/50 mix-blend-multiply -z-10"></div>

          <div className="relative z-10">
            <h2 className="font-serif text-5xl text-[#E6C77B] mb-16 tracking-wide drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Featured Surnames
            </h2>
            <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6">
              {[
                { name: "Kasliwal", desc: "From Kasli Village, Rajasthan" },
                { name: "Kasture", desc: "Symbolizing Purity And Sacred Fragrance." },
                { name: "Bacchawat", desc: "Oswal Jain Surname That Originates From Rajasthan." },
                { name: "Mate", desc: "The Surname Mate (माटे) Originates From Maharashtra" },
                { name: "Kucheriya", desc: "Jain and Bania Families In Rajasthan And Gujarat." },
                { name: "Rokade", desc: "A Marathi Surname Associated with traders And Landowners In Western Maharashtra." },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-[#FFF9F0]/90 backdrop-blur-sm border border-[#C8A951]/60 rounded-2xl p-10 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                  whileHover={{ scale: 1.03 }}
                >
                  <h3 className="font-serif text-3xl text-[#E6C77B] mb-3">{item.name}</h3>
                  <p className="font-sans text-base text-[#4A2C1A] font-medium drop-shadow-[0_1px_3px_rgba(0,0,0,0.2)]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 🌍 WHY THIS MATTERS */}
        <motion.section
          className="relative py-32 flex flex-col md:flex-row justify-center items-center gap-16 px-8 md:px-20 text-[#FAF7F0] overflow-hidden w-full bg-transparent"
          id="why-this-matters"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/Cream Brown Vintage History Project Presentation.jpg"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.6] contrast-[1.2] saturate-[1.15] -z-20"
          >
            <source src="/videos/cinematic-heritage.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-b from-[#5A3A1A]/70 via-[#3A240E]/60 to-[#FAF7F0]/50 mix-blend-multiply -z-10"></div>

          <div className="relative z-10 md:w-1/2 text-center md:text-left">
            <h2 className="font-serif text-5xl text-[#E6C77B] mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Why This Matters
            </h2>
            <p className="font-sans text-lg leading-relaxed text-[#FFF9E6] mb-8">
              We often carry our surnames proudly, but rarely stop to ask why we
              have them.{" "}
              <span className="text-[#FFD97A] font-semibold">KnowYourRoots</span>{" "}
              helps you uncover the stories, history, and lineage behind your
              surname — reconnecting you with your ancestral heritage through
              meaningful insights.
            </p>
          </div>
        </motion.section>

        {/* 🎞️ CALL TO ACTION */}
        <motion.section
          className="relative py-32 text-center text-[#FAF7F0] overflow-hidden w-full bg-transparent"
          id="cta-section"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/Cream Brown Vintage History Project Presentation.jpg"
            className="absolute inset-0 w-full h-full object-cover brightness-[0.55] contrast-[1.2] saturate-[1.1] -z-20"
          >
            <source src="/videos/cinematic-heritage.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-linear-to-b from-[#1A0E05]/60 via-[#3A250E]/50 to-[#C8A951]/40 mix-blend-multiply -z-10"></div>

          <div className="relative z-10 max-w-3xl mx-auto px-6">
            <motion.h2
              className="font-serif text-5xl sm:text-6xl text-[#E6C77B] mb-6 drop-shadow-[0_3px_10px_rgba(0,0,0,0.6)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Discover Your Surname’s Story Today
            </motion.h2>

            <motion.p
              className="font-sans text-lg sm:text-xl mb-10 text-[#FFF9E6] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              Every surname holds a story — of journeys, places, and people.  
              Uncover your roots and bring your legacy to life.
            </motion.p>

            <motion.button
              onClick={() => document.getElementById("search")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-[#C8A951] text-[#4A1A0A] font-sans px-10 py-3 rounded-md text-lg font-medium shadow-lg hover:bg-[#FAF7F0] hover:text-[#800000] transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Exploring
            </motion.button>
          </div>
        </motion.section>

        {/* ⚓ FOOTER */}
        <footer className="bg-[#FAF7F0] text-center py-6 border-t border-[#C8A951]/60 mt-0">
          <p className="font-sans text-sm text-[#333333]">
            © 2025 <span className="font-serif text-[#800000]">KnowYourRoots</span> | Built by{" "}
            <span className="text-[#800000] font-medium">Harshwardhan Kasliwal</span>
          </p>
        </footer>
        {/* ✅ Auto Donation Popup */}
{donationOpen && (
  <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm transition-opacity">

    <div className="bg-[#FAF3E4] w-80 sm:w-96 rounded-2xl shadow-2xl p-6 relative animate-fadeIn scale-95 hover:scale-100 transition">

      {/* Close Button */}
      <button 
        onClick={() => setDonationOpen(false)}
        className="absolute top-3 right-4 text-2xl font-bold text-[#4A1A0A] hover:text-red-700 transition">
        ×
      </button>

      {/* Popup Content */}
      <h2 className="text-2xl font-serif text-[#4A1A0A] mb-2 text-center">
        ❤️ Keep the Roots Alive
      </h2>
      <p className="text-sm text-center text-[#6A4A3A] mb-4 px-2">
        We research, verify and preserve **real surname history**.  
        Your support keeps this mission alive. 🌿
      </p>

      {/* Razorpay Buttons */}
      <div className="flex flex-col gap-3">
        <button onClick={() => startRazorpayPayment(49)}
          className="bg-[#C8A951] text-[#4A1A0A] py-2 rounded-lg font-semibold hover:bg-[#4A1A0A] hover:text-[#FAF7F0] transition">
          ₹49 — Appreciate 💛
        </button>

        <button onClick={() => startRazorpayPayment(99)}
          className="bg-[#C8A951] text-[#4A1A0A] py-2 rounded-lg font-semibold hover:bg-[#4A1A0A] hover:text-[#FAF7F0] transition">
          ₹99 — Support Research 📜
        </button>

        <button onClick={() => startRazorpayPayment(199)}
          className="bg-[#C8A951] text-[#4A1A0A] py-2 rounded-lg font-semibold hover:bg-[#4A1A0A] hover:text-[#FAF7F0] transition">
          ₹199 — Help Us Grow 🚀
        </button>
      </div>

      <p className="text-xs mt-4 text-center text-[#6A4A3A] opacity-80">
        Even a small help brings someone's history to life ✨
      </p>

    </div>
  </div>
)}
      </main>
    </>
  );
}
