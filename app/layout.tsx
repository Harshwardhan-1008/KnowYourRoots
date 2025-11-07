import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KnowYourRoots",
  description: "Discover the story and meaning behind your surname.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#FAF7F0]`}
      >
        {/* ✅ Navbar included at root */}
        <Navbar />

        {/* ✅ Wrap entire app */}
        <ClientLayout>
          <main className="pt-20"> {/* give padding so content doesn’t hide behind navbar */}
            {children}
          </main>
        </ClientLayout>
      </body>
    </html>
  );
}

