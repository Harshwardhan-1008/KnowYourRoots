"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed w-full top-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">

        {/* Logo */}
        <Link href="/" className="text-white font-bold text-xl tracking-wide">
          KnowYourRoots
        </Link>

        {/* Search Bar */}
        <div className="hidden md:block">
          
        </div>

        {/* Nav links */}
        <div className="flex gap-6 text-white">
          <Link href="/explore" className="hover:text-gray-300">
            Explore
          </Link>
          <Link href="/about" className="hover:text-gray-300">
            About
          </Link>
        </div>
      </div>

      {/* Search bar visible on mobile */}
      <div className="block md:hidden px-4 pb-3">
        
      </div>
    </nav>
  );
}
