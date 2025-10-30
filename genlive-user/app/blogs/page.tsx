"use client";
import { useRouter } from "next/navigation";
import React from "react";

// ======================
// 🧱 Interface Definitions
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
// 🔹 Mock Data for GenLive Blog
// ======================

const featuredPost: FeaturedPostType = {
  title: "GenLive – Bứt phá với hành trình livestream đầu tiên",
  category: "GENLIVE FEATURE",
  date: "NOV 10.2025",
  visualTitleLines: ["GENLIVE", "FIRST", "LIVESTREAM"],
};
const PRIMARY_COLOR = "#b6202b";
const trendingPosts: TrendingPostType[] = [
  {
    id: 1,
    title:
      "Livestream đầu tiên của GenLive – Bước khởi đầu cho kỷ nguyên sáng tạo nội dung tương tác",
    category: "EVENT",
    date: "NOV 10.2025",
    imageUrl: "https://placehold.co/80x80/b6202b/ffffff?text=LIVE+EVENT",
  },
  {
    id: 2,
    title:
      "Hậu trường GenLive Studio: Cơ sở vật chất hiện đại tạo nên trải nghiệm phát sóng chuyên nghiệp",
    category: "STUDIO INSIDE",
    date: "OCT 28.2025",
    imageUrl: "https://placehold.co/80x80/2f2f2f/ffffff?text=STUDIO",
  },
  {
    id: 3,
    title:
      "Gặp gỡ đội ngũ Idol và Creator đầu tiên của GenLive – Những gương mặt đầy triển vọng",
    category: "TALENTS",
    date: "OCT 20.2025",
    imageUrl: "https://placehold.co/80x80/4a148c/ffffff?text=IDOLS",
  },
  {
    id: 4,
    title:
      "GenLive Workshop #1: Làm chủ Livestream – Bí quyết tăng tương tác và giữ chân người xem",
    category: "WORKSHOP",
    date: "OCT 12.2025",
    imageUrl: "https://placehold.co/80x80/ff6f00/ffffff?text=WORKSHOP",
  },
  {
    id: 5,
    title:
      "Teaser chính thức: ‘GenLive 2025 – Where Passion Meets Creativity’ đã ra mắt!",
    category: "ANNOUNCEMENT",
    date: "OCT 05.2025",
    imageUrl: "https://placehold.co/80x80/1c1328/ffffff?text=TEASER",
  },
  {
    id: 6,
    title:
      "GenLive Network chính thức mở đăng ký đối tác Creator – Cơ hội phát triển cùng nền tảng mới",
    category: "COMMUNITY",
    date: "SEP 27.2025",
    imageUrl: "https://placehold.co/80x80/b6202b/ffffff?text=NETWORK",
  },
];

// ======================
// 🧩 Sub Components
// ======================

// 🔸 TrendingPostItem
interface TrendingPostItemProps {
  post: TrendingPostType;
}

const TrendingPostItem: React.FC<TrendingPostItemProps> = ({ post }) => {
  const router = useRouter();
  return (
    <div
      className="flex mb-4 p-0 md:p-1 lg:p-0 hover:bg-gray-50 rounded-xl transition duration-300 cursor-pointer"
      onClick={() => {
        router.push("/blogs/1");
      }}
    >
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
};

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
      {/* Background Ornaments */}
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
            onClick={() =>
              window.open("https://www.facebook.com/genlive.vn", "_blank")
            }
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
// 🧱 Main Component - BLOG
// ======================

type Page = "home" | "blog" | "talents" | "contact";

const BLOG: React.FC<BlogProps> = ({ setCurrentPage }) => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16 max-w-7xl">
        <h1
          className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-16 mt-20"
          style={{ color: "#1c1328" }}
        >
          <span className="border-b-4 border-[#b6202b] pb-1" style={{color:PRIMARY_COLOR}}>NEWS</span>
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
