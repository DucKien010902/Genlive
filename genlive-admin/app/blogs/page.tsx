// BẮT BUỘC: Đánh dấu đây là Client Component
"use client";

import axiosClient from "@/config/apiconfig";
import {
  AlertCircle,
  FileEdit,
  GripVertical,
  ImageOff,
  Loader2,
  Plus,
  Search,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
// ==========================================================
// --- Typescript Interfaces ---
// ==========================================================

// Chỉ lấy các trường cần thiết để hiển thị tóm tắt
interface ArticleSummary {
  _id: string;
  title: string;
  authorName: string;
  imageUrl: string;
  publishedAt: string; // Chuỗi ISO date
  slug: string;
}

// ==========================================================
// --- Component Chính Của Trang ---
// ==========================================================

export default function BlogManagementPage(){
  // --- State Quản lý Dữ liệu ---
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // --- State Quản lý Tương Tác ---
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // --- Lấy Dữ liệu Ban đầu ---
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get<ArticleSummary[]>("/article");
      setArticles(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bài viết:", err);
      setError("Không thể tải danh sách bài viết. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // --- Logic Lọc và Sắp xếp ---
  const filteredArticles = useMemo(() => {
    return articles.filter((article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [articles, searchTerm]);

  // --- Logic Trạng thái Chọn (Select) ---
  const isAllSelected = useMemo(() => {
    if (filteredArticles.length === 0) return false;
    return filteredArticles.every((article) => selectedIds.has(article._id));
  }, [filteredArticles, selectedIds]);

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      const allIds = new Set(filteredArticles.map((a) => a._id));
      setSelectedIds(allIds);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // --- Logic Xử lý Xóa (Delete) ---
  const handleDelete = async (id: string) => {
    // TODO: Thêm modal xác nhận thay vì confirm
    // if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    setIsDeleting(true);
    try {
      await axiosClient.delete(`/blog/${id}`);
      // Cập nhật lại state sau khi xóa
      setArticles((prev) => prev.filter((article) => article._id !== id));
      // Bỏ chọn ID đã xóa
      setSelectedIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (err) {
      console.error("Lỗi khi xóa bài viết:", err);
      // TODO: Hiển thị thông báo lỗi (ví dụ: toast)
      alert("Đã xảy ra lỗi khi xóa bài viết.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteSelected = async () => {
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;

    // TODO: Thêm modal xác nhận
    // if (!confirm(`Bạn có chắc muốn xóa ${idsToDelete.length} bài viết đã chọn?`)) return;

    setIsDeleting(true);
    try {
      await axiosClient.post("/blog/delete-many", { ids: idsToDelete });
      // Cập nhật lại state
      setArticles((prev) =>
        prev.filter((article) => !idsToDelete.includes(article._id))
      );
      setSelectedIds(new Set()); // Xóa lựa chọn
    } catch (err) {
      console.error("Lỗi khi xóa nhiều bài viết:", err);
      alert("Đã xảy ra lỗi khi xóa các bài viết.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Render Trạng thái UI ---
  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-3 text-lg text-gray-600">Đang tải bài viết...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center py-20 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <p className="mt-4 text-lg font-semibold text-red-700">{error}</p>
          <button
            onClick={fetchArticles}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tải lại
          </button>
        </div>
      );
    }

    if (filteredArticles.length === 0) {
      return (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <p className="text-lg text-gray-600">
            {searchTerm
              ? "Không tìm thấy bài viết nào."
              : "Chưa có bài viết nào."}
          </p>
        </div>
      );
    }

    // --- Render Danh sách Bài viết ---
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <BlogCard
            key={article._id}
            article={article}
            isSelected={selectedIds.has(article._id)}
            onSelect={handleSelect}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* === Header === */}
        <header className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Blog</h1>
          {/* Nút "Viết bài mới" sẽ điều hướng đến trang tạo bài
              (Đây là logic giả định, bạn có thể thay đổi) */}
          <Link
            href="/admin/blog/new"
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-md hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            <span>Viết bài mới</span>
          </Link>
        </header>

        {/* === Thanh Công cụ (Toolbar) === */}
        <div className="mb-4 p-4 bg-white rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center w-full md:w-auto">
            <input
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={isAllSelected}
              onChange={handleSelectAll}
              disabled={filteredArticles.length === 0}
            />
            <label className="ml-3 text-sm font-medium text-gray-700">
              Chọn tất cả
            </label>
          </div>
          <div className="relative w-full md:flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* === Nội dung chính (Danh sách Card) === */}
        {renderContent()}
      </div>

      {/* === Thanh Hành động (Khi đã chọn) === */}
      <ContextualActionBar
        selectedCount={selectedIds.size}
        onDeleteSelected={handleDeleteSelected}
        onDeselectAll={() => setSelectedIds(new Set())}
        isDeleting={isDeleting}
      />
    </div>
  );
}

// ==========================================================
// --- Component Thẻ Bài viết (BlogCard) ---
// ==========================================================

interface BlogCardProps {
  article: ArticleSummary;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

function BlogCard({
  article,
  isSelected,
  onSelect,
  onDelete,
  isDeleting,
}: BlogCardProps) {

  const [status, statusColor] = useMemo(() => {
    const pubDate = new Date(article.publishedAt);
    const now = new Date();
    if (pubDate > now) {
      return ["Draft", "bg-gray-100 text-gray-800"];
    }
    return ["Published", "bg-blue-100 text-blue-800"];
  }, [article.publishedAt]);

  const formattedDate = new Date(article.publishedAt).toLocaleDateString(
    "vi-VN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  return (
    <div
      className={`relative cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-200 ${
        isSelected
          ? "ring-2 ring-blue-500 shadow-blue-200"
          : "hover:shadow-xl"
      }`}
    >
      {/* --- Checkbox chọn --- */}
      <div className="absolute top-4 left-4 z-10">
        <input
          type="checkbox"
          className="h-6 w-6 rounded border-gray-400 bg-white/50 backdrop-blur-sm text-blue-600 focus:ring-blue-500"
          checked={isSelected}
          onChange={() => onSelect(article._id)}
        />
      </div>

      {/* --- Ảnh bìa --- */}
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover"
          // Fallback nếu ảnh lỗi
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
        {/* Fallback Icon nếu ảnh không tải được */}
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <ImageOff size={40} />
        </div>
      </div>

      {/* --- Nội dung thẻ --- */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          {/* Trạng thái */}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
          >
            {status}
          </span>
          {/* Menu (hiện tại chỉ là icon) */}
          <GripVertical size={18} className="text-gray-400" />
        </div>

        {/* Tiêu đề (có link tới trang chỉnh sửa) */}
        <Link
          href={`/admin/blog/edit/${article.slug}`} // Giả định route chỉnh sửa
          className="block text-lg font-semibold text-gray-900 hover:text-blue-700 transition-colors truncate"
          title={article.title}
        >
          {article.title}
        </Link>

        {/* Thông tin phụ */}
        <p className="text-sm text-gray-500 mt-1">
          bởi <span className="font-medium">{article.authorName}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>

        {/* --- Nút hành động --- */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center space-x-3">
          {/* Nút Chỉnh sửa (chuyển hướng) */}
          <Link
            href={`/admin/blog/edit/${article.slug}`}
            className="flex items-center space-x-1.5 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FileEdit size={16} />
            <span>Chỉnh sửa</span>
          </Link>

          <span className="text-gray-300">|</span>

          {/* Nút Xóa (hành động) */}
          <button
            onClick={() => onDelete(article._id)}
            disabled={isDeleting}
            className="flex items-center space-x-1.5 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            <span>Xóa</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================================
// --- Component Thanh Hành động (Contextual) ---
// ==========================================================

interface ContextualActionBarProps {
  selectedCount: number;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
  isDeleting: boolean;
}

const ContextualActionBar: React.FC<ContextualActionBarProps> = ({
  selectedCount,
  onDeselectAll,
  onDeleteSelected,
  isDeleting,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center justify-between p-4 bg-gray-900 text-white rounded-lg shadow-2xl">
          <div className="flex items-center space-x-3">
            <span className="bg-blue-600 rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold">
              {selectedCount}
            </span>
            <span className="font-medium">Đã chọn</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onDeselectAll}
              className="text-sm font-medium text-gray-300 hover:text-white"
            >
              Bỏ chọn
            </button>
            <button
              onClick={onDeleteSelected}
              disabled={isDeleting}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
              <span>Xóa mục đã chọn</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
