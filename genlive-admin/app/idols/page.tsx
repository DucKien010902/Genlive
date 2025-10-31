"use client";

import { useEffect, useMemo, useState } from "react";
// Đảm bảo đường dẫn này chính xác
import axiosClient from "@/config/apiconfig";

// 1. Định nghĩa Interface đầy đủ
interface Talent {
  _id: string; // ID của MongoDB
  ID: number;
  name: string;
  handle: string;
  followers: string;
  category: string;
  imageUrl: string;
  description: string;
}

// 2. Định nghĩa state rỗng cho talent mới
const initialNewTalent: Omit<Talent, '_id'> = {
  ID: 0, // Hoặc một giá trị ID mặc định
  name: "",
  handle: "",
  followers: "0",
  category: "VTuber",
  imageUrl: "https://via.placeholder.com/150",
  description: "",
};

export default function ManageTalentsPage() {
  // === STATE CƠ BẢN ===
  const [isClient, setIsClient] = useState(false);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === STATE CHO BỘ LỌC/TÌM KIẾM ===
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  // === STATE CHO CHỌN NHIỀU (NEW) ===
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // === STATE CHO MODAL (ADD/EDIT) ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedTalent, setSelectedTalent] = useState<Omit<Talent, '_id'> | Talent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // 3. useEffect để fetch dữ liệu lần đầu
  useEffect(() => {
    setIsClient(true);
    setLoading(true);

    axiosClient.get("/talents")
      .then(response => {
        const data: Talent[] = response.data || [];
        setTalents(data);
        const uniqueCategories = [...new Set(data.map(t => t.category))];
        setCategories(uniqueCategories);
      })
      .catch(err => {
        console.error("Lỗi fetch talents:", err);
        setError(err.message || "Lỗi không xác định");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 4. Lọc dữ liệu bằng useMemo để tối ưu
  const filteredTalents = useMemo(() => {
    let newFilteredList = [...talents];

    if (filterCategory) {
      newFilteredList = newFilteredList.filter(
        talent => talent.category === filterCategory
      );
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      newFilteredList = newFilteredList.filter(
        talent =>
          talent.name.toLowerCase().includes(lowerSearchTerm) ||
          talent.handle.toLowerCase().includes(lowerSearchTerm) ||
          talent.ID.toString().includes(lowerSearchTerm)
      );
    }
    return newFilteredList;
  }, [searchTerm, filterCategory, talents]);

  // --- 5. HÀM XỬ LÝ CHỌN NHIỀU (NEW) ---

  const handleSelectTalent = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredTalents.length) {
      // Bỏ chọn tất cả (chỉ những cái đang lọc)
      setSelectedIds([]);
    } else {
      // Chọn tất cả (chỉ những cái đang lọc)
      setSelectedIds(filteredTalents.map(t => t._id));
    }
  };

  // --- 6. HÀM XỬ LÝ MODAL (ADD/EDIT) ---

  const handleOpenAddModal = () => {
    setSelectedTalent(initialNewTalent);
    setModalMode("add");
    setIsModalOpen(true);
    setModalError(null);
  };

  const handleOpenEditModal = (talent: Talent) => {
    setSelectedTalent({ ...talent }); // Tạo bản sao
    setModalMode("edit");
    setIsModalOpen(true);
    setModalError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTalent(null);
    setIsSubmitting(false);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!selectedTalent) return;
    const { name, value } = e.target;
    setSelectedTalent(prev => ({
      ...prev!,
      [name]: name === 'ID' ? parseInt(value) || 0 : value, // Chuyển ID sang số
    }));
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTalent) return;

    setIsSubmitting(true);
    setModalError(null);

    if (modalMode === 'add') {
      // --- XỬ LÝ THÊM MỚI ---
      axiosClient.post("/talents", selectedTalent)
        .then(response => {
          // Thêm talent mới vào đầu danh sách
          setTalents(prev => [response.data, ...prev]);
          handleCloseModal();
        })
        .catch(err => setModalError(err.message || "Lỗi khi thêm"))
        .finally(() => setIsSubmitting(false));
    } else {
      // --- XỬ LÝ CẬP NHẬT ---
      const talentToUpdate = selectedTalent as Talent;
      axiosClient.put(`/talents/${talentToUpdate._id}`, talentToUpdate)
        .then(response => {
          setTalents(prev =>
            prev.map(t =>
              t._id === talentToUpdate._id ? response.data : t
            )
          );
          handleCloseModal();
        })
        .catch(err => setModalError(err.message || "Lỗi khi cập nhật"))
        .finally(() => setIsSubmitting(false));
    }
  };

  // --- 7. HÀM XỬ LÝ XÓA (NEW) ---

  // Xóa 1 talent
  const handleDeleteTalent = (_id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${name}?`)) return;

    axiosClient.delete(`/talents/${_id}`)
      .then(() => {
        setTalents(prev => prev.filter(t => t._id !== _id));
        setSelectedIds(prev => prev.filter(id => id !== _id)); // Xóa khỏi ds đã chọn
      })
      .catch(err => {
        console.error("Lỗi xóa talent:", err);
        alert("Xóa thất bại: " + err.message);
      });
  };

  // Xóa nhiều talents
  const handleDeleteSelected = () => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedIds.length} talent đã chọn?`)) return;

    // Giả định backend hỗ trợ xóa nhiều qua body: { ids: [...] }
    axiosClient.delete("/talents", { data: { ids: selectedIds } })
      .then(() => {
        setTalents(prev => prev.filter(t => !selectedIds.includes(t._id)));
        setSelectedIds([]); // Xóa hết ds đã chọn
      })
      .catch(err => {
        console.error("Lỗi xóa hàng loạt:", err);
        alert("Xóa hàng loạt thất bại: " + err.message);
      });
  };

  // --- 8. LOGIC RENDER CHÍNH ---

  if (!isClient) {
    return <div className="p-6">Đang khởi tạo trang...</div>;
  }
  if (loading) {
    return <div className="p-6">Đang tải dữ liệu từ API...</div>;
  }
  if (error) {
    return <div className="p-6 text-red-500">Lỗi khi tải dữ liệu: {error}</div>;
  }

  // UI Chính
  return (
    <div className="p-4 ">
      <h1 className="text-3xl font-bold mb-6">Quản lý Talents</h1>

      {/* === KHU VỰC ĐIỀU KHIỂN === */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Bộ lọc */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Tìm theo Tên, Handle, ID..."
            className="w-full sm:w-64 px-4 py-2 border rounded-lg shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <select
            className="w-full sm:w-48 px-4 py-2 border rounded-lg shadow-sm"
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        {/* Nút hành động */}
        <div className="flex gap-2 w-full md:w-auto">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex-1 md:flex-none justify-center px-4 py-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition"
            >
              Xóa ({selectedIds.length})
            </button>
          )}
          <button
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-none justify-center flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition"
          >
            {/* SVG icon Thêm */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            Thêm Talent
          </button>
        </div>
      </div>

      {/* === BẢNG DỮ LIỆU === */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left w-12">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={filteredTalents.length > 0 && selectedIds.length === filteredTalents.length}
                  onChange={handleSelectAll}
                  disabled={filteredTalents.length === 0}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Handle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTalents.length > 0 ? (
              filteredTalents.map(talent => (
                <tr key={talent._id} className={selectedIds.includes(talent._id) ? "bg-blue-50" : ""}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedIds.includes(talent._id)}
                      onChange={() => handleSelectTalent(talent._id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{talent.ID}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{talent.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-500">@{talent.handle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{talent.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-4">
                      {/* Nút Sửa */}
                      <button
                        onClick={() => handleOpenEditModal(talent)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Chỉnh sửa"
                      >
                        {/* SVG icon Sửa */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" /></svg>
                      </button>
                      {/* Nút Xóa */}
                      <button
                        onClick={() => handleDeleteTalent(talent._id, talent.name)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        {/* SVG icon Xóa */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Không tìm thấy talent nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === MODAL THÊM MỚI / CHỈNH SỬA === */}
      {isModalOpen && selectedTalent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            <form onSubmit={handleSubmitModal}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {modalMode === 'add' ? "Thêm Talent Mới" : "Chỉnh sửa Talent"}
                  </h2>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {/* SVG icon Đóng */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Nội dung Card */}
                <div className="space-y-4">
                  {modalMode === 'edit' && (
                    <div className="text-center">
                      <img
                        src={selectedTalent.imageUrl}
                        alt={selectedTalent.name}
                        className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-gray-200"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ID (Hệ thống)</label>
                      <input
                        type="number"
                        name="ID"
                        value={selectedTalent.ID}
                        onChange={handleFormChange}
                        className={`w-full mt-1 p-2 border rounded-md ${modalMode === 'edit' ? 'bg-gray-100' : ''}`}
                        readOnly={modalMode === 'edit'} // Chỉ cho sửa ID khi thêm mới
                        required
                      />
                    </div>
                     <div>
                      <label className="block text-sm font-medium text-gray-700">Handle</label>
                      <input
                        type="text"
                        name="handle"
                        value={selectedTalent.handle}
                        onChange={handleFormChange}
                        className="w-full mt-1 p-2 border rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tên</label>
                    <input
                      type="text"
                      name="name"
                      value={selectedTalent.name}
                      onChange={handleFormChange}
                      className="w-full mt-1 p-2 border rounded-md"
                      required
                    />
                  </div>

                   <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Followers</label>
                      <input
                        type="text"
                        name="followers"
                        value={selectedTalent.followers}
                        onChange={handleFormChange}
                        className="w-full mt-1 p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Category</label>
                      <input
                        type="text"
                        name="category"
                        value={selectedTalent.category}
                        onChange={handleFormChange}
                        className="w-full mt-1 p-2 border rounded-md"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      name="imageUrl"
                      value={selectedTalent.imageUrl}
                      onChange={handleFormChange}
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                      name="description"
                      rows={4}
                      value={selectedTalent.description}
                      onChange={handleFormChange}
                      className="w-full mt-1 p-2 border rounded-md"
                    />
                  </div>

                  {modalError && (
                    <p className="text-sm text-red-600">{modalError}</p>
                  )}
                </div>
              </div>

              {/* Footer của Modal */}
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:bg-blue-300"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? (modalMode === 'add' ? "Đang thêm..." : "Đang cập nhật...")
                    : (modalMode === 'add' ? "Thêm Mới" : "Cập nhật")
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
