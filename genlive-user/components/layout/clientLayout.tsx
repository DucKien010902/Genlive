"use client";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/header";
import { AnimatePresence, motion, useAnimationFrame } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// --- Spinner component ---
function LoadingSpinner() {
  const numDots = 7; // số chấm
  const radius = 40; // bán kính vòng tròn quanh logo

  const colors = [
    "#b6202b",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  // Góc hiện tại của mỗi dot (radian)
  const [angles, setAngles] = useState(
    Array.from({ length: numDots }, (_, i) => (i / numDots) * 2 * Math.PI),
  );

  // Animate từng dot theo vòng tròn
  useAnimationFrame((time, delta) => {
    const speed = 0.05; // tăng tốc độ quay
    setAngles((prev) => prev.map((a) => a + speed)); // tất cả chấm quay cùng tốc độ
  });

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Logo Genlive ở giữa */}
      <img
        src="/images/melive-logo.png"
        alt="Genlive"
        className="w-16 h-16 rounded-full z-10"
      />

      {/* Chấm tròn quay */}
      {angles.map((angle, i) => {
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        return (
          <div
            key={i}
            className="w-4 h-4 rounded-full absolute"
            style={{
              backgroundColor: colors[i % colors.length],
              transform: `translate(${x}px, ${y}px)`,
            }}
          />
        );
      })}
    </div>
  );
}

// --- Main layout ---
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Hiệu ứng scroll cho trang chủ
  useEffect(() => {
    if (pathname !== "/") return;

    const handleScroll = () => {
      const scrolled = window.scrollY > 100;
      setIsScrolled(scrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Cuộn lên đầu khi đổi trang + loading animation
  useEffect(() => {
    setIsLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  const shouldBeScrolled = pathname !== "/" || isScrolled;

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loading-spinner"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner />
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar isScrolled={shouldBeScrolled} />

      <motion.main
        key={pathname}
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.main>

      <Footer />
    </>
  );
}
