"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  const [isAuth, setIsAuth] = useState<boolean | null>(null); 
  // null: chưa check xong, tránh flicker

  useEffect(() => {
    const auth = sessionStorage.getItem("auth");
    setIsAuth(auth === "true");

    // Nếu chưa login và không phải đang ở /login => redirect
    if (!auth && pathname !== "/login") {
      router.push("/login");
    }
  }, [pathname, router]);

  // Khi đang check thì tránh render layout => chống nhấp nháy
  if (isAuth === null) return null;

  // Nếu đang ở trang login thì render login layout
  if (isLoginPage) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        {children}
      </main>
    );
  }

  // Nếu chưa đăng nhập => đã redirect ở trên
  if (!isAuth) return null;

  // Nếu đã login => render full layout
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
