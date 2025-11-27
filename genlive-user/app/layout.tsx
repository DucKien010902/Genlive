import ClientLayout from "@/components/layout/clientLayout";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// =====================================================
// FIXED METADATA CHO 4 TRANG
// =====================================================

// Metadata trang chủ
export const metadata: Metadata = {
  title: "GENLIVE - Livestream & Digital Content Platform",
  description:
    "GENLIVE - Livestream entertainment & digital content platform connecting creators and audiences.",
  keywords: "GenLive, livestream, content creator, digital content",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  }
};



// =====================================================
// LAYOUT
// =====================================================
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        <Suspense fallback={<div>Loading...</div>}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
