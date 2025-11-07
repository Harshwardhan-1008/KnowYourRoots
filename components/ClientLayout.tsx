"use client";

import { ParallaxProvider } from "react-scroll-parallax";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ParallaxProvider>
      {children}

      {/* 🌌 Floating Dust Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(white,transparent_70%)] opacity-10 animate-float"></div>
      </div>
    </ParallaxProvider>
  );
}
