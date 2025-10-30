"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// Import thêm useState
import React, { useEffect, useState } from "react";

type Page = "home" | "blog" | "talents" | "contact";

interface NavItemProps {
  name: string;
  targetPage: Page;
  pathname: string;
  isScrolled: boolean;
  variant?: "desktop" | "mobile"; // Phân biệt layout
  onClickCallback?: () => void; // Callback để đóng menu mobile
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  targetPage,
  pathname,
  isScrolled,
  variant = "desktop",
  onClickCallback,
}) => {
  const router = useRouter();

  // Đường dẫn tương ứng
  const path =
    targetPage === "home"
      ? "/"
      : targetPage === "blog"
        ? "/blogs"
        : targetPage === "talents"
          ? "/talents"
          : "/jobs";

  const isCurrent = pathname === path;
  const isMobile = variant === "mobile";

  // ✅ Menu mobile luôn dùng màu của trạng thái "scrolled" vì nền luôn đục
  const effectiveIsScrolled = isScrolled || isMobile;

  // Màu sắc
  const baseColor = effectiveIsScrolled
    ? "text-gray-700 dark:text-gray-300"
    : "text-white";
  const hoverColor = effectiveIsScrolled
    ? "hover:text-pink-600 dark:hover:text-pink-400"
    : "hover:text-pink-300";
  const activeColor = effectiveIsScrolled
    ? "text-pink-600 border-b-2 border-pink-600 dark:text-pink-500 dark:border-pink-500" // Thêm dark mode cho active
    : "text-pink-400 border-b-2 border-pink-400";

  // ✅ Custom điều hướng + hiệu ứng ẩn trang + đóng menu mobile
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClickCallback?.(); // Gọi callback để đóng menu (nếu có)

    if (pathname === path) return; // Không làm gì nếu đã ở trang đó

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
        ${isMobile ? "block text-base" : "text-sm"}
        px-3 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer
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
  const pathname = usePathname() || "";

  // ✅ State quản lý việc đóng/mở menu mobile
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ✅ Prefetch thủ công
  useEffect(() => {
    router.prefetch("/blogs");
    router.prefetch("/talents");
    router.prefetch("/jobs");
  }, [router]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isScrolled || isMobileMenuOpen // ✅ Giữ nền trắng nếu menu mobile đang mở
            ? "bg-white shadow-md dark:bg-gray-900"
            : "bg-transparent shadow-none"
        }`}
    >
      {/* Container cho layout desktop/tablet */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="flex items-center h-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <img
                src="/images/Logo Genlive.png"
                alt="GenLive Logo"
                className={`h-10 mt-2 w-auto transition-opacity duration-300 ${
                  isScrolled || isMobileMenuOpen ? "opacity-100" : "opacity-80"
                }`}
              />
            </Link>
          </div>

          {/* Nav menu (Desktop/Tablet) */}
          <div className="hidden md:flex flex-1 justify-center">
            {/* ✅ Giảm space trên tablet, tăng trên desktop */}
            <div className="flex space-x-6 lg:space-x-12">
              <NavItem
                name="Home"
                targetPage="home"
                pathname={pathname}
                isScrolled={isScrolled}
              />
              <NavItem
                name="Talents"
                targetPage="talents"
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
                name="Recruitment"
                targetPage="contact"
                pathname={pathname}
                isScrolled={isScrolled}
              />
            </div>
          </div>

          {/* Phía bên phải: Spacer (Desktop) hoặc Nút Hamburger (Mobile) */}
          <div className="flex items-center">
            {/* Spacer (Desktop) */}
            <div className="hidden md:block w-20" />

            {/* Nút Hamburger (Mobile) */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                type="button"
                className={`inline-flex items-center justify-center p-2 rounded-md transition-colors
                  ${
                    isScrolled || isMobileMenuOpen
                      ? "text-gray-700 hover:text-pink-600 dark:text-gray-300"
                      : "text-white hover:text-pink-300"
                  }
                  focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500`}
                aria-controls="mobile-menu"
                aria-expanded={isMobileMenuOpen}
              >
                <span className="sr-only">Mở menu chính</span>
                {/* Icon "menu" */}
                {!isMobileMenuOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  /* Icon "close" */
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu (Dropdown) */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-white dark:bg-gray-900 shadow-lg" // ✅ Nền đục riêng cho menu mobile
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItem
              name="Home"
              targetPage="home"
              pathname={pathname}
              isScrolled={true} // Force màu "scrolled"
              variant="mobile"
              onClickCallback={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              name="Talents"
              targetPage="talents"
              pathname={pathname}
              isScrolled={true}
              variant="mobile"
              onClickCallback={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              name="Blogs"
              targetPage="blog"
              pathname={pathname}
              isScrolled={true}
              variant="mobile"
              onClickCallback={() => setIsMobileMenuOpen(false)}
            />
            <NavItem
              name="Jobs"
              targetPage="contact"
              pathname={pathname}
              isScrolled={true}
              variant="mobile"
              onClickCallback={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
