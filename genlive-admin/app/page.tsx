"use client";
import {
  DollarSign,
  FileText,
  MessageSquare,
  Radio,
  Star,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
// Đã xóa 'Image' từ 'lucide-react' vì đó là import sai.
// Sẽ sử dụng thẻ <img> của HTML.
import React from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// --- MÀU THƯƠNG HIỆU ---
const PRIMARY_COLOR = "#b6202b"; // Màu đỏ GenLive

// --- DỮ LIỆU MẪU (Mock Data) ---

// Dữ liệu biểu đồ doanh thu (Giữ nguyên)
const revenueData = [
  { name: "01/10", revenue: 4000 },
  { name: "07/10", revenue: 3000 },
  { name: "14/10", revenue: 2000 },
  { name: "21/10", revenue: 2780 },
  { name: "28/10", revenue: 1890 },
  { name: "30/10", revenue: 2390 },
];

// Dữ liệu Top Idols (Giữ nguyên)
const topIdols = [
  {
    id: 1,
    name: "Linh Chi",
    avatar: "https://placehold.co/100x100/F9A8D4/1F2937?text=LC",
    revenue: 1250,
  },
  {
    id: 2,
    name: "Minh Anh",
    avatar: "https://placehold.co/100x100/A5B4FC/1F2937?text=MA",
    revenue: 980,
  },
  {
    id: 3,
    name: "Khánh Vy",
    avatar: "https://placehold.co/100x100/FDE68A/1F2937?text=KV",
    revenue: 750,
  },
];

// Dữ liệu Hoạt động (Giữ nguyên)
const activityFeed = [
  {
    id: 1,
    icon: Radio,
    color: "text-red-500",
    text: (
      <>
        <strong>Linh Chi</strong> vừa bắt đầu livestream!
      </>
    ),
    time: "5 phút trước",
  },
  {
    id: 2,
    icon: FileText,
    color: "text-blue-500",
    text: "Bài blog 'Sự kiện Mùa Hè' đã được đăng.",
    time: "2 giờ trước",
  },
  {
    id: 3,
    icon: UserCheck,
    color: "text-green-500",
    text: "Minh Anh đã đạt 10,000 người theo dõi.",
    time: "Hôm qua",
  },
];

// Dữ liệu Báo cáo Stream (MỚI)
const recentStreams = [
  {
    id: "s-001",
    idol: {
      name: "Linh Chi",
      avatar: "https://placehold.co/100x100/F9A8D4/1F2937?text=LC",
    },
    title: "Buổi tối hát hò cùng Linh Chi 🎵",
    viewers: 4800,
    revenue: 350,
    status: "Live",
  },
  {
    id: "s-002",
    idol: {
      name: "Khánh Vy",
      avatar: "https://placehold.co/100x100/FDE68A/1F2937?text=KV",
    },
    title: "Chơi game & trò chuyện cuối tuần",
    viewers: 2100,
    revenue: 120,
    status: "Live",
  },
  {
    id: "s-003",
    idol: {
      name: "Gia Hân",
      avatar: "https://placehold.co/100x100/A7F3D0/1F2937?text=GH",
    },
    title: "Unbox quà fan gửi (Phần 2)",
    viewers: 1500,
    revenue: 85,
    status: "Live",
  },
  {
    id: "s-004",
    idol: {
      name: "Minh Anh",
      avatar: "https://placehold.co/100x100/A5B4FC/1F2937?text=MA",
    },
    title: "Stream tâm sự đêm khuya...",
    viewers: 3200,
    revenue: 210,
    status: "Offline",
  },
];

// --- CÁC COMPONENT GIAO DIỆN ---

// Interface cho StatCard (TypeScript)
interface StatCardProps {
  title: string;
  value: string;
  change: string; // Thêm % thay đổi
  icon: React.ElementType;
  iconBgColor: string;
  iconTextColor: string;
}

// 1. Component Thẻ Thống kê (Nâng cấp)
function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBgColor,
  iconTextColor,
}: StatCardProps) {
  const isPositive = change.startsWith("+");
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className={`rounded-full p-3 ${iconBgColor}`}>
          <Icon size={22} className={iconTextColor} />
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${
            isPositive ? "text-green-500" : "text-red-500"
          }`}
        >
          <TrendingUp
            size={14}
            className={!isPositive ? "rotate-180" : ""}
          />
          {change}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-500">{title}</p>
      </div>
    </div>
  );
}

// 2. Component Biểu đồ Doanh thu (Giữ nguyên)
function RevenueChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={revenueData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.8} />
              <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value / 1000}k`} // Rút gọn
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
            formatter={(value: number) => [
              `$${value.toLocaleString()}`,
              "Doanh thu",
            ]}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke={PRIMARY_COLOR}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// 3. Component Bảng Top Idols (Đã sửa <img>)
function TopIdolsTable() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Top Idols (Tháng này)
      </h2>
      <div className="space-y-4">
        {topIdols.map((idol, index) => (
          <div key={idol.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-5 text-base font-bold text-gray-400">
                {index + 1}
              </span>
              {/* === SỬA ĐỔI: Dùng <img> thay vì <Image> === */}
              <img
                src={idol.avatar}
                alt={idol.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                loading="lazy"
              />
              {/* === Kết thúc sửa đổi === */}
              <div>
                <p className="font-semibold text-gray-800">{idol.name}</p>
                {index === 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium text-yellow-500">
                    <Star size={12} fill="currentColor" />
                    Top 1
                  </span>
                )}
              </div>
            </div>
            <span
              className="font-semibold text-green-500"
            >
              +${idol.revenue.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 4. Component Feed Hoạt động (Giữ nguyên)
function ActivityFeed() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Hoạt động Gần đây
      </h2>
      <ul className="space-y-5">
        {activityFeed.map((item) => (
          <li key={item.id} className="flex gap-3">
            <span
              className={`mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${item.color} bg-opacity-10`}
            >
              <item.icon size={16} />
            </span>
            <div>
              <p className="text-sm text-gray-700">{item.text}</p>
              <span className="text-xs text-gray-400">{item.time}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 5. Component Báo cáo Stream (MỚI)
function DetailedStreamReport() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
       <h2 className="p-6 text-lg font-semibold text-gray-900">
        Báo cáo Livestream Chi tiết
      </h2>

      {/* Table container */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Idol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Tiêu đề Stream
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Người xem
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Doanh thu (Buổi)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {recentStreams.map((stream) => (
              <tr key={stream.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* === SỬA ĐỔI: Dùng <img> thay vì <Image> === */}
                    <img
                      src={stream.idol.avatar}
                      alt={stream.idol.name}
                      className="h-10 w-10 rounded-full object-cover"
                      loading="lazy"
                    />
                    <span className="font-medium text-gray-900">{stream.idol.name}</span>
                  </div>
                </td>
                <td className="max-w-xs whitespace-nowrap px-6 py-4">
                  <span className="text-sm text-gray-700 truncate">{stream.title}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-semibold text-gray-900">{stream.viewers.toLocaleString()}</span>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className="text-sm font-medium text-green-600">${stream.revenue.toLocaleString()}</span>
                </td>
                {/* <td className="whitespace-nowrap px-6 py-4">
                  {stream.status === "Live" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-600">
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      Live
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                      Offline
                    </span>
                  )}
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


// --- COMPONENT TRANG CHÍNH (Đã sắp xếp lại) ---

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-8">
      <h1 className="mb-6 text-3xl font-bold text-gray-900">
        Dashboard GenLive
      </h1>

      {/* 1. Lưới các thẻ thống kê */}
      <div className="mb-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Doanh thu (Tháng)"
          value="$12,580"
          change="+12.5%"
          icon={DollarSign}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
        />
        <StatCard
          title="Người xem (Hiện tại)"
          value="8,490"
          change="+5.2%"
          icon={Users}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
        />
        <StatCard
          title="Idols đang Live"
          value="3"
          change="-1"
          icon={Radio}
          iconBgColor="bg-red-100"
          iconTextColor="text-red-600"
        />
        <StatCard
          title="Tổng Chat (Giờ)"
          value="25,1k"
          change="+8.1%"
          icon={MessageSquare}
          iconBgColor="bg-purple-100"
          iconTextColor="text-purple-600"
        />
      </div>

      {/* 2. Lưới nội dung chính (Biểu đồ và Cột bên) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

        {/* Cột chính (Biểu đồ + Bảng chi tiết) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Biểu đồ */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Tổng quan Doanh thu (30 ngày qua)
            </h2>
            <RevenueChart />
          </div>

          {/* Bảng chi tiết (MỚI) */}
          <DetailedStreamReport />
        </div>

        {/* Cột bên (Top Idols và Hoạt động) */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <TopIdolsTable />
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
