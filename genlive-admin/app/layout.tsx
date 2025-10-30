import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LayoutClient from "./components/admin/LayoutClient"; // ✅ tách phần client ra riêng
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GenLive Admin Dashboard",
  description: "Trang quản trị GenLive",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
