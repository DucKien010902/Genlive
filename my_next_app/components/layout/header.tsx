"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Page = "home" | "blog" | "library" | "contact";

interface NavItemProps {
  name: string;
  targetPage: Page;
  pathname: string;
  isScrolled: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  targetPage,
  pathname,
  isScrolled,
}) => {
  const router = useRouter();

  // Đường dẫn tương ứng
  const path =
    targetPage === "home"
      ? "/"
      : targetPage === "blog"
      ? "/blogs"
      : targetPage === "library"
      ? "/library"
      : "/apply";

  const isCurrent = pathname === path;

  // Màu sắc
  const baseColor = isScrolled
    ? "text-gray-700 dark:text-gray-300"
    : "text-white";
  const hoverColor = isScrolled
    ? "hover:text-pink-600 dark:hover:text-pink-400"
    : "hover:text-pink-300";
  const activeColor = isScrolled
    ? "text-pink-600 border-b-2 border-pink-600"
    : "text-pink-400 border-b-2 border-pink-400";

  // ✅ Custom điều hướng + hiệu ứng ẩn trang
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (pathname === path) return;

    document.body.classList.add("page-fade-out");
    setTimeout(() => {
      router.push(path);
    }, 250);
  };

  return (
    <a
      href={path}
      onClick={handleClick}
      aria-current={isCurrent ? "page" : undefined}
      className={`
        px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 cursor-pointer
        ${isCurrent ? activeColor : `${baseColor} ${hoverColor}`}
      `}
    >
      {name}
    </a>
  );
};

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Prefetch thủ công để chắc chắn mọi route đã sẵn sàng
  useEffect(() => {
    router.prefetch("/blogs");
    router.prefetch("/library");
    router.prefetch("/apply");
  }, [router]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? "bg-white shadow-md" : "bg-transparent shadow-none"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center h-full">
              <img
                src="/images/Logo Genlive.png"
                alt="GenLive Logo"
                className={`h-10 mt-2 w-auto transition-opacity duration-300 ${
                  isScrolled ? "opacity-100" : "opacity-80"
                }`}
              />
            </Link>
          </div>

          {/* Nav menu */}
          <div className="flex-1 flex justify-center">
            <div className="flex space-x-12">
              <NavItem
                name="Home"
                targetPage="home"
                pathname={pathname}
                isScrolled={isScrolled}
              />
              <NavItem
                name="Library"
                targetPage="library"
                pathname={pathname}
                isScrolled={isScrolled}
              />
              <NavItem
                name="Blogs"
                targetPage="blog"
                pathname={pathname}
                isScrolled={isScrolled}
              />
              <NavItem
                name="Apply"
                targetPage="contact"
                pathname={pathname}
                isScrolled={isScrolled}
              />
            </div>
          </div>

          {/* Cân đối hai bên */}
          <div className="w-20" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
