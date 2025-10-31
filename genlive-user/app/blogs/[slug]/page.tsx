// BẮT BUỘC: Đánh dấu đây là Client Component
"use client";

import { Clock, Eye, Folder, Tag } from "lucide-react";
import { useEffect, useState } from "react";
// Giả định bạn có file axiosClient trong "@/lib/axiosClient"
import axiosClient from "@/config/apiconfig";
import { useParams } from "next/navigation";
// (Nếu bạn chưa có file này, tôi sẽ cung cấp ở Bước 3 trong câu trả lời trước)

// ==========================================================
// --- Typescript Interfaces (Dựa trên Mongoose Schema) ---
// ==========================================================

/**
 * Định nghĩa kiểu cho một khối nội dung (content block)
 */
interface ContentBlock {
  _id?: string; // Mongoose tự động thêm _id
  type: string;
  level?: number;
  style?: string;
  text?: string;
  items?: string[];
}

/**
 * Định nghĩa kiểu cho toàn bộ đối tượng bài viết (Article)
 */
interface Article {
  _id: string; // Mongoose _id
  blogID: string;
  slug: string;
  date: string;
  imageUrl: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorAvatar: string;
  publishedAt: string; // Sẽ là chuỗi ISO date string từ API
  category: string;
  tags: string[];
  views: number;
  content: ContentBlock[];
  createdAt?: string; // Mongoose timestamps
  updatedAt?: string; // Mongoose timestamps
}

// --- Helper và Component con (Đã thêm Types) ---

/**
 * Helper để định dạng ngày (Đã thêm Types)
 */
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Định nghĩa kiểu cho props của RenderContent
 */
interface RenderContentProps {
  content: ContentBlock[];
}

/**
 * Component Render Nội Dung (Đã thêm Types)
 */
function RenderContent({ content }: RenderContentProps){
  if (!content) return null; // Thêm bảo vệ nếu content chưa có

  return (
    <>
      {content.map((block, index) => {
        const key = `content-${index}`;

        switch (block.type) {
          case "paragraph":
            if (block.style === "lead") {
              return (
                <p
                  key={key}
                  className="lead text-lg md:text-xl text-gray-700 dark:text-gray-400 mb-6"
                >
                  {block.text}
                </p>
              );
            }
            return (
              <p key={key} className="mb-4">
                {block.text}
              </p>
            );
          case "heading":
            if (block.level === 2) {
              return (
                <h2
                  key={key}
                  className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4"
                >
                  {block.text}
                </h2>
              );
            }
            break;
          case "list":
            // Thêm kiểm tra an toàn cho block.items
            if (!block.items) return null;
            return (
              <ul
                key={key}
                className="list-disc list-inside space-y-2 mb-6 pl-4"
              >
                {block.items.map((item: string, itemIndex: number) => (
                  <li
                    key={itemIndex}
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                ))}
              </ul>
            );
          case "quote":
            return (
              <blockquote
                key={key}
                className="border-l-4 border-purple-500 pl-4 py-2 my-6 italic text-gray-700 dark:text-gray-400"
              >
                {block.text}
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

// ==========================================================
// COMPONENT CHÍNH CỦA TRANG (ĐÃ CẬP NHẬT SANG TYPESCRIPT)
// ==========================================================

/**
 * Định nghĩa kiểu cho props của trang (từ params)
 */
interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = useParams() as { slug: string };
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        // 👇 Gọi API với slug động
        const response = await axiosClient.get(`/article/${slug}`);
        setArticle(response.data);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);


  // 3. Xử lý các trạng thái UI
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Đang tải bài viết...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  // Sau bước kiểm tra này, TypeScript biết 'article' không còn là null
  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Không tìm thấy bài viết.
      </div>
    );
  }

  // 4. Render nội dung khi đã có dữ liệu (JSX không đổi)
  return (
    <div className="bg-white text-gray-900 ">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 mt-10">
        {/* --- Phần Header Bài Viết --- */}
        <header className="mb-8">
          <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
            <Folder size={16} className="mr-2" />
            <span className="font-semibold text-sm uppercase">
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
            {article.title}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6">
            {article.excerpt}
          </p>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <span className="font-medium text-gray-400 ">
                {article.authorName}
              </span>
            </div>

            <span className="hidden md:block">|</span>

            <div className="flex items-center">
              <Clock size={14} className="mr-1.5" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>

            <span className="hidden md:block">|</span>

            <div className="flex items-center">
              <Eye size={14} className="mr-1.5" />
              <span>{article.views.toLocaleString("vi-VN")} lượt xem</span>
            </div>
          </div>
        </header>

        {/* --- Ảnh Bìa --- */}
        <figure className="mb-8">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-auto rounded-lg object-cover shadow-lg"
            style={{ aspectRatio: "16/9" }}
          />
        </figure>

        {/* --- Nội Dung Bài Viết --- */}
        <article className="max-w-none">
          <RenderContent content={article.content} />
        </article>

        {/* --- Phần Tags --- */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-wrap gap-2">
            <Tag size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800
                           text-gray-700 dark:text-gray-300
                           rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
