// BẮT BUỘC: Đánh dấu đây là Client Component
"use client";

import axiosClient from "@/config/apiconfig";
import {
  ArrowDown,
  ArrowUp,
  Clock,
  Edit,
  Eye,
  Folder,
  Heading,
  List,
  Pilcrow,
  PlusCircle,
  Save,
  Tag,
  Trash2,
  X
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

// ==========================================================
// --- Typescript Interfaces (Không đổi) ---
// ==========================================================
interface ContentBlock {
  _id?: string;
  type: string;
  level?: number;
  style?: string;
  text?: string;
  items?: string[];
}

interface Article {
  _id: string;
  blogID: string;
  slug: string;
  date: string;
  imageUrl: string;
  title: string;
  excerpt: string;
  authorName: string;
  authorAvatar: string;
  publishedAt: string;
  category: string;
  tags: string[];
  views: number;
  content: ContentBlock[];
  createdAt?: string;
  updatedAt?: string;
}

// --- Helper và Component con (Không đổi) ---

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface RenderContentProps {
  content: ContentBlock[];
}

/**
 * Component CHỈ HIỂN THỊ nội dung tĩnh (Khi không ở chế độ chỉnh sửa)
 */
function RenderContent({ content }: RenderContentProps) {
  if (!content) return null;

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
            // Thêm H3, H4 nếu cần
            if (block.level === 3) {
              return (
                <h3
                  key={key}
                  className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3"
                >
                  {block.text}
                </h3>
              );
            }
            break;
          case "list":
            if (!block.items) return null;
            return (
              <ul
                key={key}
                className="list-disc list-inside space-y-2 mb-6 pl-4"
              >
                {block.items.map((item: string, itemIndex: number) => (
                  <li
                    key={itemIndex}
                    // Dùng dangerouslySetInnerHTML nếu item có chứa HTML (ví dụ: link)
                    // Nếu item là text thuần, dùng: <li>{item}</li>
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
// --- Props (Không đổi) ---
// ==========================================================
interface ArticleDetailPageProps {
  params: {
    slug: string;
  };
}

// ==========================================================
// COMPONENT CHÍNH CỦA TRANG (ĐÃ NÂNG CẤP)
// ==========================================================
export default function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = useParams() as { slug: string };

  // --- State gốc ---
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- STATE MỚI: Dành cho chỉnh sửa tại chỗ ---
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  // formData sẽ giữ bản sao của article để chỉnh sửa
  const [formData, setFormData] = useState<Partial<Article>>({});

  // --- Logic tải dữ liệu (Cập nhật để set cả formData) ---
  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(`/article/${slug}`);
        setArticle(response.data);
        // QUAN TRỌNG: Sao chép dữ liệu vào formData khi tải xong
        setFormData(response.data);
      } catch (err) {
        console.error("Lỗi khi tải bài viết:", err);
        setError("Không thể tải bài viết. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // ==========================================================
  // --- LOGIC MỚI: Xử lý Chỉnh sửa, Hủy, và Lưu ---
  // ==========================================================

  /**
   * Bật chế độ chỉnh sửa
   */
  const handleEditToggle = () => {
    // Đảm bảo formData được đồng bộ với article mới nhất trước khi sửa
    if (article) {
      setFormData(article);
    }
    setIsEditing(true);
  };

  /**
   * Hủy chỉnh sửa, quay lại dữ liệu gốc
   */
  const handleCancel = () => {
    setIsEditing(false);
    // Khôi phục formData về trạng thái của article (hủy mọi thay đổi)
    if (article) {
      setFormData(article);
    }
  };

  /**
   * Xử lý các input đơn giản (title, excerpt, ...)
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Xử lý Tags (chuyển chuỗi thành mảng)
   */
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsArray = e.target.value.split(",").map((tag) => tag.trim());
    setFormData((prev) => ({
      ...prev,
      tags: tagsArray,
    }));
  };

  /**
   * Lưu thay đổi lên server
   */
  const handleSave = async () => {
    setSaving(true);
    try {
      // Gửi formData (đã được cập nhật) lên server
      const response = await axiosClient.put(`/article/${slug}`, formData);

      // Cập nhật lại state 'article' (nguồn dữ liệu chính)
      setArticle(response.data);
      // Cập nhật formData để đồng bộ
      setFormData(response.data);
      // Tắt chế độ chỉnh sửa
      setIsEditing(false);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Lỗi khi lưu bài viết:", err);
      alert("Đã xảy ra lỗi khi lưu. Vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================================
  // --- LOGIC MỚI: Trình chỉnh sửa khối (Copy từ Admin) ---
  // --- Các hàm này sẽ cập nhật trực tiếp 'formData' ---
  // ==========================================================

  const handleBlockChange = (
    index: number,
    field: keyof ContentBlock,
    value: any
  ) => {
    setFormData((prev) => {
      const newContent = [...(prev.content || [])];
      newContent[index] = { ...newContent[index], [field]: value };
      return { ...prev, content: newContent };
    });
  };

  const handleListItemChange = (
    blockIndex: number,
    itemIndex: number,
    value: string
  ) => {
    setFormData((prev) => {
      const newContent = [...(prev.content || [])];
      const block = { ...newContent[blockIndex] };
      const newItems = [...(block.items || [])];
      newItems[itemIndex] = value;
      block.items = newItems;
      newContent[blockIndex] = block;
      return { ...prev, content: newContent };
    });
  };

  const addListItem = (blockIndex: number) => {
    setFormData((prev) => {
      const newContent = [...(prev.content || [])];
      const block = { ...newContent[blockIndex] };
      block.items = [...(block.items || []), ""];
      newContent[blockIndex] = block;
      return { ...prev, content: newContent };
    });
  };

  const removeListItem = (blockIndex: number, itemIndex: number) => {
    setFormData((prev) => {
      const newContent = [...(prev.content || [])];
      const block = { ...newContent[blockIndex] };
      block.items = (block.items || []).filter((_, i) => i !== itemIndex);
      newContent[blockIndex] = block;
      return { ...prev, content: newContent };
    });
  };

  const addBlock = (type: "paragraph" | "heading" | "list" | "quote") => {
    let newBlock: ContentBlock;
    switch (type) {
      case "heading":
        newBlock = { type: "heading", level: 2, text: "" };
        break;
      case "list":
        newBlock = { type: "list", style: "unordered", items: [""] };
        break;
      case "quote":
        newBlock = { type: "quote", text: "" };
        break;
      case "paragraph":
      default:
        newBlock = { type: "paragraph", text: "" };
        break;
    }
    setFormData((prev) => ({
      ...prev,
      content: [...(prev.content || []), newBlock],
    }));
  };

  const removeBlock = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      content: (prev.content || []).filter((_, i) => i !== index),
    }));
  };

  const moveBlock = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === (formData.content?.length || 0) - 1)
    ) {
      return;
    }
    setFormData((prev) => {
      const newContent = [...(prev.content || [])];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      [newContent[index], newContent[targetIndex]] = [
        newContent[targetIndex],
        newContent[index],
      ];
      return { ...prev, content: newContent };
    });
  };

  /**
   * Component MỚI: Render trình chỉnh sửa cho từng khối
   * (Đọc và ghi vào 'formData')
   */
  const renderBlockEditor = (block: ContentBlock, index: number) => {
    switch (block.type) {
      case "paragraph":
        return (
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500 uppercase">
              Đoạn văn
            </label>
            <textarea
              value={block.text || ""}
              onChange={(e) => handleBlockChange(index, "text", e.target.value)}
              rows={5}
              className="w-full p-2 border rounded-md text-base"
              placeholder="Nhập nội dung đoạn văn..."
            />
          </div>
        );
      case "heading":
        return (
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500 uppercase">
              Tiêu đề
            </label>
            <div className="flex items-center gap-2">
              <select
                value={block.level || 2}
                onChange={(e) =>
                  handleBlockChange(index, "level", Number(e.target.value))
                }
                className="p-2 border rounded-md bg-gray-50 font-bold"
              >
                <option value={2}>H2</option>
                <option value={3}>H3</option>
              </select>
              <input
                type="text"
                value={block.text || ""}
                onChange={(e) =>
                  handleBlockChange(index, "text", e.target.value)
                }
                className="w-full p-2 border rounded-md text-xl font-bold"
                placeholder="Nhập nội dung tiêu đề..."
              />
            </div>
          </div>
        );
      case "list":
        return (
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500 uppercase">
              Danh sách
            </label>
            <div className="space-y-2 pl-4">
              {(block.items || []).map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center gap-2">
                  <span className="text-gray-500">&bull;</span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) =>
                      handleListItemChange(index, itemIndex, e.target.value)
                    }
                    className="w-full p-2 border rounded-md"
                    placeholder="Nội dung mục..."
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(index, itemIndex)}
                    className="p-1 text-red-500 hover:text-red-700"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addListItem(index)}
                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
              >
                <PlusCircle size={16} /> Thêm mục
              </button>
            </div>
          </div>
        );
      case "quote":
        return (
          <div>
            <label className="block text-xs font-semibold mb-1 text-gray-500 uppercase">
              Trích dẫn
            </label>
            <textarea
              value={block.text || ""}
              onChange={(e) => handleBlockChange(index, "text", e.target.value)}
              rows={3}
              className="w-full p-2 border rounded-md italic"
              placeholder="Nhập nội dung trích dẫn..."
            />
          </div>
        );
      default:
        return (
          <p className="text-red-500">Block không xác định: {block.type}</p>
        );
    }
  };

  // ==========================================================
  // --- Render (Các trạng thái gốc) ---
  // ==========================================================

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

  // Sau bước này, 'article' không còn là null
  if (!article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Không tìm thấy bài viết.
      </div>
    );
  }

  // ==========================================================
  // --- Render (Trang chính với logic Chỉnh sửa) ---
  // ==========================================================
  return (
    <div className="bg-white text-gray-900 relative">
      {/* --- THANH CÔNG CỤ CHỈNH SỬA MỚI --- */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {saving ? (
                "Đang lưu..."
              ) : (
                <>
                  <Save size={18} /> Lưu
                </>
              )}
            </button>
            <button
              onClick={handleCancel}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg shadow-lg hover:bg-gray-700"
            >
              <X size={18} /> Hủy
            </button>
          </>
        ) : (
          <button
            onClick={handleEditToggle}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700"
          >
            <Edit size={18} /> Chỉnh sửa
          </button>
        )}
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 mt-0">
        {/* --- Phần Header Bài Viết --- */}
        <header className="mb-8">
          <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
            <Folder size={16} className="mr-2" />
            {isEditing ? (
              <input
                type="text"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
                className="font-semibold text-sm uppercase bg-gray-100 border rounded-md px-2 py-1"
              />
            ) : (
              <span className="font-semibold text-sm uppercase">
                {article.category}
              </span>
            )}
          </div>

          {isEditing ? (
            <textarea
              name="title"
              value={formData.title || ""}
              onChange={handleChange}
              rows={2}
              className="w-full text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight border rounded-md p-2 resize-none"
            />
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
              {article.title}
            </h1>
          )}

          {isEditing ? (
            <textarea
              name="excerpt"
              value={formData.excerpt || ""}
              onChange={handleChange}
              rows={3}
              className="w-full text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6 border rounded-md p-2"
            />
          ) : (
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6">
              {article.excerpt}
            </p>
          )}

          {/* Thông tin tác giả/ngày/views thường không thể chỉnh sửa */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {/* (Phần này giữ nguyên) */}
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
          {isEditing && (
            <div className="mb-2">
              <label className="block text-sm font-medium mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                value={formData.imageUrl || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          )}
          <img
            // Hiển thị ảnh từ formData nếu đang sửa, nếu không thì từ article
            src={isEditing ? formData.imageUrl : article.imageUrl}
            alt={isEditing ? formData.title : article.title}
            className="w-full h-auto rounded-lg object-cover shadow-lg"
            style={{ aspectRatio: "16/9" }}
          />
        </figure>

        {/* --- Nội Dung Bài Viết --- */}
        <article className="max-w-none">
          {isEditing ? (
            // ===================================
            // === RENDER TRÌNH CHỈNH SỬA KHỐI ===
            // ===================================
            <div className="space-y-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
              {(formData.content || []).map((block, index) => (
                <div
                  key={index}
                  className="bg-white p-4 border rounded-md shadow-sm relative group"
                >
                  {/* Thanh công cụ cho Block */}
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => moveBlock(index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(index, "down")}
                      disabled={index === (formData.content?.length || 0) - 1}
                      className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="p-1 rounded-md bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  {/* Render trình chỉnh sửa */}
                  {renderBlockEditor(block, index)}
                </div>
              ))}
              {/* Nút thêm Block mới */}
              <div className="flex justify-center items-center gap-2 pt-4 border-t">
                <span className="text-sm font-medium">Thêm khối mới:</span>
                <button
                  type="button"
                  onClick={() => addBlock("paragraph")}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  <Pilcrow size={16} /> Đoạn văn
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("heading")}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  <Heading size={16} /> Tiêu đề
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("list")}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  <List size={16} /> Danh sách
                </button>
                <button
                  type="button"
                  onClick={() => addBlock("quote")}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                >
                  <span className="font-bold text-lg">"</span> Trích dẫn
                </button>
              </div>
            </div>
          ) : (
            // ===================================
            // === RENDER NỘI DUNG TĨNH ===
            // ===================================
            <RenderContent content={article.content} />
          )}
        </article>

        {/* --- Phần Tags --- */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-wrap gap-2">
            <Tag size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
            {isEditing ? (
              <input
                type="text"
                name="tags"
                value={formData.tags ? formData.tags.join(", ") : ""}
                onChange={handleTagsChange}
                className="w-full p-2 border rounded-md"
                placeholder="Nhập tags, cách nhau bằng dấu phẩy"
              />
            ) : (
              article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-800
                             text-gray-700 dark:text-gray-300
                             rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
