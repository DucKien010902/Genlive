"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type Page = "home" | "blog" | "talents" | "contact";

interface NavItemProps {
  name: string;
  targetPage: Page;
  pathname: string;
  isScrolled: boolean;
  variant?: "desktop" | "mobile";
  onClickCallback?: () => void;
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

  // ✅ Màu khi scroll hoặc đang ở mobile menu (nền đen)
  const baseColor = "text-white";
  const hoverColor = "hover:text-pink-400";
  const activeColor = "text-pink-400 border-b-2 border-pink-400";

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClickCallback?.();
    if (pathname === path) return;

    document.body.classList.add("page-fade-out");
    setTimeout(() => router.push(path), 250);
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    router.prefetch("/blogs");
    router.prefetch("/talents");
    router.prefetch("/jobs");
  }, [router]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${
          isScrolled || isMobileMenuOpen
            ? "bg-black shadow-md"
            : "bg-transparent"
        }`}
    >
      {/* Container chính */}
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
                src="/images/Logo Genlive2.png"
                alt="GenLive Logo"
                className="h-20 w-auto rounded-xl transition-opacity duration-300"
              />
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex flex-1 justify-center">
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

          {/* Nút Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className={`inline-flex items-center justify-center p-2 rounded-md text-white hover:text-pink-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500`}
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Mở menu chính</span>
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

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-black shadow-lg"
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItem
              name="Home"
              targetPage="home"
              pathname={pathname}
              isScrolled={true}
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
