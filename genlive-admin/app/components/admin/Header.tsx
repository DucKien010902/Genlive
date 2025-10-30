"use client"; // Cần thiết để sử dụng hooks (useState, useRouter)

import {
  Bell,
  LogOut,
  Settings,
  User,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation"; // Sử dụng App Router
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref để detect click bên ngoài

  // Xử lý đóng dropdown khi click ra bên ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Nếu click bên ngoài <div ref={dropdownRef}>
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }
    // Gắn event listener
    document.addEventListener("mousedown", handleClickOutside);
    // Dọn dẹp
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    setIsDropdownOpen(false);
    // Chuyển hướng về trang login
    router.push("/login");
  };

  // Hàm bật/tắt dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Thanh tìm kiếm (Giữ nguyên) */}
      <div className="relative">
        {/* <Search ... /> */}
      </div>

      {/* Icon và User */}
      <div className="flex items-center space-x-4">
        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={20} />
        </button>

        {/* === PHẦN TÀI KHOẢN (ĐÃ CẬP NHẬT) === */}
        {/* Bọc trong div relative để định vị dropdown */}
        <div className="relative" ref={dropdownRef}>
          {/* Nút bấm để mở dropdown */}
          <button
            onClick={toggleDropdown}
            className="flex cursor-pointer items-center space-x-2 rounded-full p-2 pr-3 transition-colors duration-200 hover:bg-gray-100"
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
          >
            <UserCircle size={28} className="text-gray-600" />
            <span className="text-sm font-medium">Admin GenLive</span>
          </button>

          {/* Card Dropdown (Hiển thị có điều kiện với hiệu ứng) */}
          <div
            className={`
              absolute right-0 top-full mt-2 w-56
              origin-top-right rounded-md bg-white
              shadow-xl ring-1 ring-black ring-opacity-5
              focus:outline-none transition ease-out duration-100
              ${
                isDropdownOpen
                  ? "transform opacity-100 scale-100" // Trạng thái hiển thị
                  : "transform opacity-0 scale-95 pointer-events-none" // Trạng thái ẩn
              }
            `}
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
          >
            <div className="py-1" role="none">
              {/* Phần thông tin User */}
              <div className="border-b border-gray-100 px-4 py-3">
                <p className="text-sm font-semibold text-gray-900">
                  Admin GenLive
                </p>
                <p className="truncate text-sm text-gray-500">
                  admin@genlive.com
                </p>
              </div>

              {/* Phần Lựa chọn */}
              <div className="py-1" role="none">
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100"
                  role="menuitem"
                >
                  <User size={16} className="text-gray-500" />
                  Hồ sơ
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100"
                  role="menuitem"
                >
                  <Settings size={16} className="text-gray-500" />
                  Cài đặt
                </a>
              </div>

              {/* Phần Đăng xuất */}
              <div className="py-1" role="none">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-700"
                  role="menuitem"
                >
                  <LogOut size={16} />
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
