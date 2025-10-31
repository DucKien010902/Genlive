"use client";
import axiosClient from "@/config/apiconfig";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PRIMARY_COLOR = "#b6202b";

interface FeaturedPostType {
  title: string;
  category: string;
  date: string;
  visualTitleLines: string[];
}

interface TrendingPostType {
  blogID: number | string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  slug: string;
}

interface BlogProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

type Page = "home" | "blog" | "talents" | "contact";

// 🔹 Component TrendingPostItem
const TrendingPostItem: React.FC<{ post: TrendingPostType }> = ({ post }) => {
  const router = useRouter();
  return (
    <div
      className="flex mb-4 hover:bg-gray-50 rounded-xl p-1 cursor-pointer transition"
      onClick={() => router.push(`/blogs/${post.slug}`)}
    >
      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden mr-4">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-full object-cover"
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

// 🔹 Component FeaturedPost
const FeaturedPost: React.FC<{ post: FeaturedPostType }> = ({ post }) => (
  <div className="w-full">
    <div
      className="relative rounded-[2rem] overflow-hidden mb-6 p-8 h-[450px] shadow-2xl"
      style={{
        backgroundColor: "#1c1328",
        backgroundImage: "linear-gradient(135deg, #3a2253 0%, #1c1328 100%)",
      }}
    >
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-600/30 rounded-full blur-2xl"></div>
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-purple-400/30 rounded-full blur-xl"></div>

      <div className="relative z-10 flex flex-col justify-center h-full px-4 sm:px-12 text-left">
        {post.visualTitleLines.map((word, index) => (
          <span
            key={index}
            className="block text-white text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight py-0.5"
          >
            {word}
          </span>
        ))}
        <div className="mt-8">
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

// 🔹 Component TrendingNews
const TrendingNews: React.FC<{ posts: TrendingPostType[] }> = ({ posts }) => (
  <div className="w-full mt-12 lg:mt-0 lg:pl-8">
    <h3 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-6 border-b border-red-500/20 pb-2">
      TRENDING NEWS
    </h3>
    <div className="space-y-6">
      {posts.map((post) => (
        <TrendingPostItem key={post.blogID} post={post} />
      ))}
    </div>
  </div>
);

// ========================
// 🧱 MAIN COMPONENT
// ========================
const BLOG: React.FC<BlogProps> = ({ setCurrentPage }) => {
  const [posts, setPosts] = useState<TrendingPostType[]>([]);
  const [featured, setFeatured] = useState<FeaturedPostType | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await axiosClient.get("/article");
        const articles: TrendingPostType[] = res.data;

        setPosts(articles);

        if (articles.length > 0) {
          setFeatured({
            title: articles[0].title,
            category: articles[0].category,
            date: articles[0].date,
            visualTitleLines: articles[0].title
              .split(" ")
              .slice(0, 3)
              .map((w) => w.toUpperCase()),
          });
        }
      } catch (err) {
        console.error("Lỗi tải bài viết:", err);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-12 lg:py-16 max-w-7xl">
        <h1
          className="text-5xl lg:text-7xl font-extrabold text-gray-900 mb-16 mt-20"
          style={{ color: "#1c1328" }}
        >
          <span
            className="border-b-4 border-[#b6202b] pb-1"
            style={{ color: PRIMARY_COLOR }}
          >
            NEWS
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 lg:pr-8">
            {featured ? <FeaturedPost post={featured} /> : <p>Đang tải...</p>}
          </div>

          <div className="lg:w-1/3">
            <TrendingNews posts={posts} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BLOG;
