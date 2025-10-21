"use client";
import React from "react";

// ======================
// 🧱 Interface định nghĩa kiểu dữ liệu
// ======================

interface FeaturedPostType {
  title: string;
  category: string;
  date: string;
  visualTitleLines: string[];
}

interface TrendingPostType {
  id: number;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
}
interface BlogProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

// ======================
// 🔹 Dữ liệu giả định (Mock Data)
// ======================

const featuredPost: FeaturedPostType = {
  title: "GenLive - những con số ấn tượng của năm 2024",
  category: "BIZ NEWS",
  date: "FEB 03.2025",
  visualTitleLines: ["2024", "WRAPPED ON", "YOUTUBE"],
};

const trendingPosts: TrendingPostType[] = [
  {
    id: 1,
    title:
      "Hoa hậu Thùy Tiên tung trailer 'Địu Đêm' mùa 3, fan rần rần với dàn Anh Trai khách mời",
    category: "BIZ NEWS",
    date: "JAN 21.2025",
    imageUrl: "https://placehold.co/80x80/2f2f2f/ffffff?text=Video+TN",
  },
  {
    id: 2,
    title:
      "Chiến dịch Tết Đến Rồi! #TếtGenLive - Cơ hội 100% tương tác cùng GenLive Network",
    category: "WASSUPYOUTUBE",
    date: "JAN 06.2025",
    imageUrl: "https://placehold.co/80x80/b6202b/ffffff?text=CD+H%C4%90+100%25",
  },
  {
    id: 3,
    title: "Workshop: YouTube Tết 2025 - Giải Mã Số Liệu, Bứt Phá Nội Dung",
    category: "WASSUPYOUTUBE",
    date: "DEC 30.2024",
    imageUrl: "https://placehold.co/80x80/b6202b/ffffff?text=TET+2025",
  },
  {
    id: 4,
    title: "Nâng Tầm Sáng Tạo Với Các Cập Nhật Mới Nhất Từ YouTube Shopping",
    category: "WASSUPYOUTUBE",
    date: "DEC 23.2024",
    imageUrl: "https://placehold.co/80x80/2f2f2f/ffffff?text=YOUTUBE+SHOP",
  },
];

// ======================
// 🧩 Component con
// ======================

// 🔸 TrendingPostItem
interface TrendingPostItemProps {
  post: TrendingPostType;
}

const TrendingPostItem: React.FC<TrendingPostItemProps> = ({ post }) => (
  <div className="flex mb-4 p-0 md:p-1 lg:p-0 hover:bg-gray-50 rounded-xl transition duration-300 cursor-pointer">
    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden mr-4">
      <img
        src={post.imageUrl}
        alt={post.title}
        className="w-full h-full object-cover"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = "https://placehold.co/80x80/cccccc/333333?text=Thumb";
        }}
      />
    </div>
    <div className="flex-grow pt-1">
      <p className="text-base font-semibold text-gray-800 leading-snug mb-1 hover:text-[#b6202b] transition">
        {post.title}
      </p>
      <div className="flex items-center text-[10px] space-x-1">
        <span className="font-bold text-gray-500">{post.category}</span>
        <span className="text-gray-400">•</span>
        <span className="text-gray-500">{post.date}</span>
      </div>
    </div>
  </div>
);

// 🔸 FeaturedPost
interface FeaturedPostProps {
  post: FeaturedPostType;
}

const FeaturedPost: React.FC<FeaturedPostProps> = ({ post }) => (
  <div className="w-full">
    <div
      className="relative rounded-[2rem] overflow-hidden mb-6 p-8 h-[450px] shadow-2xl"
      style={{
        backgroundColor: "#1c1328",
        backgroundImage: "linear-gradient(135deg, #3a2253 0%, #1c1328 100%)",
      }}
    >
      {/* Các khối nền 3D */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-600/30 rounded-full blur-2xl transform rotate-45"></div>
      <div className="absolute top-1/4 left-4 w-10 h-10 bg-red-600/80 rounded-xl opacity-80 rotate-12"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-400/30 rounded-full blur-xl"></div>

      <div className="relative z-10 text-left flex flex-col justify-center h-full px-4 sm:px-12">
        <div className="text-white text-4xl sm:text-6xl font-extrabold tracking-tight">
          {post.visualTitleLines.map((word, index) => (
            <span key={index} className="block leading-tight py-0.5">
              {word}
            </span>
          ))}
        </div>

        <div className="mt-8 flex items-center">
          <button
            className="px-12 py-3 rounded-full font-bold text-white shadow-xl transition duration-300"
            style={{
              background: "linear-gradient(to right, #e94d87, #b6202b)",
            }}
          >
            KHÁM PHÁ NGAY
          </button>
        </div>
      </div>
    </div>

    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 leading-snug hover:text-[#b6202b] transition duration-300 cursor-pointer">
      {post.title}
    </h2>
    <div className="flex items-center text-sm space-x-2">
      <span className="font-bold text-[#b6202b]">{post.category}</span>
      <span className="text-gray-400">•</span>
      <span className="text-gray-500">{post.date}</span>
    </div>
  </div>
);

// 🔸 TrendingNews
interface TrendingNewsProps {
  posts: TrendingPostType[];
}

const TrendingNews: React.FC<TrendingNewsProps> = ({ posts }) => (
  <div className="w-full mt-12 lg:mt-0 lg:pl-8">
    <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-6 border-b border-red-500/20 pb-2">
      TRENDING NEWS
    </h3>
    <div className="space-y-6">
      {posts.map((post) => (
        <TrendingPostItem key={post.id} post={post} />
      ))}
    </div>
  </div>
);

// ======================
// 🧱 Component chính - BLOG
// ======================
type Page = "home" | "blog" | "library" | "contact";

const BLOG: React.FC<BlogProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16 max-w-7xl">
        <h1
          className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-16 mt-20"
          style={{ color: "#1c1328" }}
        >
          <span className="border-b-4 border-[#b6202b] pb-1">BLOG</span>
        </h1>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 lg:pr-8">
            <FeaturedPost post={featuredPost} />
          </div>

          <div className="lg:w-1/3">
            <TrendingNews posts={trendingPosts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BLOG;
