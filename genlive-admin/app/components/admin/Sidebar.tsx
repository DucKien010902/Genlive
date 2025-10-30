'use client';

import { FileText, LayoutDashboard, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Quản lý Idols', href: '/idols', icon: Users },
  { name: 'Quản lý Blogs', href: '/blogs', icon: FileText },
  { name: 'Quản lý JOB', href: '/jobs', icon: FileText },
  { name: 'Cài đặt', href: '/settings', icon: Settings }, // Thêm 1 trang
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col overflow-y-auto border-r border-gray-200 bg-gray-800 text-white">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">GenLive Admin</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <item.icon size={20} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
