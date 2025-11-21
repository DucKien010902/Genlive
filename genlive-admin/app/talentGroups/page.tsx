// Đặt tại app/admin/talent-groups/page.tsx
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axiosClient from '@/config/apiconfig';
import { Plus, Trash2, Edit, X, Upload, Save } from 'lucide-react'; // (Tùy chọn) Thêm icon nếu bạn có cài lucide-react, nếu không có thể dùng text thường

// --- Typescript Interface ---
interface TalentGroup {
  _id?: string; 
  id: number;    
  name: string;
  handle: string;
  followers?: string;
  category?: string;
  imageUrl?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Giá trị mặc định cho form tạo mới
const initialTalentGroupState: TalentGroup = {
  id: 0, // 0 đại diện cho item mới chưa có ID
  name: '',
  handle: '',
  followers: '',
  category: '',
  description: '',
  imageUrl: '',
};

// --- Hằng số Cloudinary ---
const CLOUDINARY_CLOUD_NAME = "da6f4dmql"; 
const CLOUDINARY_UPLOAD_PRESET = "genlive_unsigned_upload"; 

// --- Component chính ---
export default function TalentGroupsPage() {
  // State cho danh sách
  const [talentGroups, setTalentGroups] = useState<TalentGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho Modal và Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<TalentGroup>(initialTalentGroupState);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false); // Xác định đang thêm hay sửa

  // State cho Upload ảnh
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  // --- Data Fetching ---
  useEffect(() => {
    fetchTalentGroups();
  }, []);

  const fetchTalentGroups = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/talentGroup'); 
      setTalentGroups(response.data);
    } catch (err) {
      setError("Không thể tải danh sách talent groups. Vui lòng thử lại.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Actions Handlers ---

  // 1. Mở Modal để THÊM MỚI
  const handleAddNew = () => {
    setSelectedTalent({ ...initialTalentGroupState });
    setIsEditMode(false); // Đánh dấu là chế độ thêm mới
    setModalError(null);
    setImageUploadError(null);
    setIsModalOpen(true);
  };

  // 2. Mở Modal để CHỈNH SỬA
  const handleEdit = (group: TalentGroup) => {
    setSelectedTalent({ ...group });
    setIsEditMode(true); // Đánh dấu là chế độ chỉnh sửa
    setModalError(null);
    setImageUploadError(null);
    setIsModalOpen(true);
  };

  // 3. Xử lý XÓA
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa nhóm này không? Hành động này không thể hoàn tác.")) {
      return;
    }

    try {
      // Gọi API DELETE: router.delete("/:id", ...)
      await axiosClient.delete(`/talentGroup/${id}`);
      
      // Cập nhật UI: Lọc bỏ item đã xóa
      setTalentGroups(prev => prev.filter(item => item.id !== id));
    } catch (err: any) {
      console.error("Lỗi khi xóa:", err);
      alert(err.response?.data?.message || "Xóa thất bại. Vui lòng thử lại.");
    }
  };

  const handleCloseModal = () => {
    if (isSaving || isUploadingImage) return;
    setIsModalOpen(false);
  };

  // --- Form Handlers ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedTalent(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // 4. Xử lý SUBMIT (Tự động chọn POST hoặc PUT)
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setModalError(null);

    try {
      let response;
      if (isEditMode) {
        // --- UPDATE (PUT) ---
        // API: router.put("/:id", ...)
        response = await axiosClient.put(
          `/talentGroup/${selectedTalent.id}`, 
          selectedTalent
        );
        
        // Cập nhật item trong danh sách
        const updatedGroup = response.data;
        setTalentGroups(prev => prev.map(g => g.id === updatedGroup.id ? updatedGroup : g));

      } else {
        // --- CREATE (POST) ---
        // API: router.post("/", ...)
        // Loại bỏ id giả (0) nếu backend tự sinh ID, hoặc gửi nguyên object tùy backend của bạn
        const { id, ...newGroupData } = selectedTalent; 
        response = await axiosClient.post('/talentGroup', newGroupData);
        
        // Thêm item mới vào đầu danh sách
        const createdGroup = response.data;
        setTalentGroups(prev => [createdGroup, ...prev]);
      }

      handleCloseModal();
    } catch (err: any) {
      console.error("Lỗi khi lưu:", err);
      setModalError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng kiểm tra lại.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- Image Upload Handler ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        setImageUploadError("File không hợp lệ. Vui lòng chọn ảnh.");
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        setImageUploadError("Ảnh quá lớn. Vui lòng chọn ảnh dưới 5MB.");
        return;
    }

    setIsUploadingImage(true);
    setImageUploadError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await axiosClient.post(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            formData
        );
        const imageUrl = response.data.secure_url;
        
        setSelectedTalent(prev => ({
            ...prev,
            imageUrl: imageUrl,
        }));
    } catch (err: any) {
        console.error("Lỗi upload ảnh:", err);
        setImageUploadError("Tải ảnh thất bại.");
    } finally {
        setIsUploadingImage(false);
        e.target.value = ''; 
    }
  };

  // --- Render UI ---
  if (isLoading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      
      {/* Header & Nút Thêm Mới */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Talent Groups</h1>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 shadow-sm transition-all"
        >
          {/* Icon dấu cộng (dùng text nếu ko có thư viện icon) */}
          <span>+</span> Thêm nhóm mới
        </button>
      </div>

      {/* --- Danh sách Talent Groups --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {talentGroups.map((group) => (
          <div 
            key={group.id} 
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="relative h-48">
                <img
                src={group.imageUrl || 'https://via.placeholder.com/400x300.png?text=No+Image'}
                alt={group.name}
                className="w-full h-full object-cover"
                />
                {/* Badge Category */}
                {group.category && (
                    <span className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {group.category}
                    </span>
                )}
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1" title={group.name}>{group.name}</h3>
              <p className="text-sm text-blue-600 mb-1">@{group.handle}</p>
              <p className="text-sm text-gray-500 mb-4">Followers: {group.followers || '0'}</p>
              
              {/* Action Buttons Group */}
              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => handleEdit(group)}
                  className="flex-1 bg-blue-50 text-blue-600 py-2 px-3 rounded-md hover:bg-blue-100 transition-colors font-medium text-sm border border-blue-200"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(group.id)}
                  className="flex-none bg-red-50 text-red-600 py-2 px-3 rounded-md hover:bg-red-100 transition-colors border border-red-200"
                  title="Xóa nhóm này"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {talentGroups.length === 0 && (
          <div className="text-center text-gray-400 py-10">Chưa có nhóm nào. Hãy tạo mới!</div>
      )}

      {/* --- Modal (Create/Edit) --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={handleCloseModal}></div>

          <div className="bg-white rounded-xl shadow-2xl z-50 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <form onSubmit={handleSubmit}>
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-5 border-b bg-gray-50 rounded-t-xl">
                <h2 className="text-xl font-bold text-gray-800">
                    {isEditMode ? `Chỉnh sửa: ${selectedTalent.name}` : 'Thêm Talent Group mới'}
                </h2>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving || isUploadingImage}
                  className="text-gray-400 hover:text-red-500 transition-colors text-2xl leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-5">
                {modalError && (
                  <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded text-sm">
                    {modalError}
                  </div>
                )}

                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhóm <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="name"
                      value={selectedTalent.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="VD: Gen Z Team"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Handle<span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="handle"
                      value={selectedTalent.handle}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="VD: genz_team"
                      required
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng Followers</label>
                    <input
                      type="text"
                      name="followers"
                      value={selectedTalent.followers || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="VD: 1.2M"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục (có thể là tên nhóm)</label>
                    <input
                      type="text"
                      name="category"
                      value={selectedTalent.category || ''}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="VD: Music, Vlog..."
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={selectedTalent.description || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Nhập mô tả ngắn về nhóm..."
                  />
                </div>

                {/* Image Upload Area */}
                <div className="border-t pt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện (URL hoặc Upload)</label>
                  <div className="flex gap-4 items-start">
                     {/* Preview Image */}
                    <div className="w-32 h-24 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden shrink-0">
                        {selectedTalent.imageUrl ? (
                            <img src={selectedTalent.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-xs text-gray-400">No Image</span>
                        )}
                    </div>
                    
                    <div className="flex-1 space-y-3">
                        <input
                            type="text"
                            name="imageUrl"
                            value={selectedTalent.imageUrl || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="https://example.com/image.jpg"
                        />
                        <div className="flex items-center gap-2">
                            <label 
                                className={`cursor-pointer px-4 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition-colors ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isUploadingImage ? 'Đang tải...' : 'Chọn ảnh từ máy'}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploadingImage} />
                            </label>
                            {imageUploadError && <span className="text-xs text-red-600">{imageUploadError}</span>}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end p-5 border-t bg-gray-50 rounded-b-xl space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving || isUploadingImage}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploadingImage}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isSaving ? 'Đang xử lý...' : (isEditMode ? 'Lưu thay đổi' : 'Tạo mới')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}