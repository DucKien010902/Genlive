'use client';
import axiosClient from '@/config/apiconfig';
import axios from 'axios'; // Import axios để kiểm tra lỗi
import { Eye, FileEdit, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import slugify from "slugify";
// --- 1. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU (TYPES) ---

// Interface cho đối tượng Job (dựa trên Schema)
interface Job {
  _id: string; // Thêm _id của MongoDB
  jobID: number;
  title: string;
  type: 'Full-time' | 'Part-time' | 'Other';
  location: string;
  deadline: string;
  salary: string;
  isNegotiable: boolean;
  numberApply: number;
  createdAt?: string; // Thêm từ timestamps
  updatedAt?: string; // Thêm từ timestamps
}

// Kiểu dữ liệu cho Form. Dùng Omit để loại bỏ các trường do DB tạo
// và Partial để cho phép `_id` có thể có hoặc không
type JobFormData = Partial<Omit<Job, 'createdAt' | 'updatedAt'>>;

// Props cho JobModal
interface JobModalProps {
  job: JobFormData | null; // job có thể là 1 object (edit) hoặc null (add)
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: JobFormData) => void;
  isLoading: boolean;
}

// Props cho DeleteConfirmModal
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

// --- 2. COMPONENT CON ---

// Component Modal cho Form Thêm/Sửa
const JobModal: React.FC<JobModalProps> = ({ job, isOpen, onClose, onSave, isLoading }) => {
  // Định nghĩa state cho form data
  const [formData, setFormData] = useState<JobFormData | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(
        job
          ? { ...job } // Chế độ Sửa: load data từ prop
          : {
              // Chế độ Thêm: data mặc định
              title: '',
              type: 'Full-time',
              location: '',
              deadline: '',
              salary: '',
              isNegotiable: false,
              jobID: Math.floor(Math.random() * 10000), // Tạm thời
              numberApply: 0,
            }
      );
    }
  }, [job, isOpen]);

  // Handle change cho input, select
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Xử lý cho checkbox
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev!,
        [name]: checked,
      }));
    } else {
      // Xử lý cho text, select
      setFormData((prev) => ({
        ...prev!,
        [name]: value,
      }));
    }
  };

  // Handle submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
    }
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 rounded-full bg-white p-1.5 text-gray-600 shadow-md hover:bg-gray-100 hover:text-gray-800"
        >
          <X size={20} />
        </button>
        <h2 className="mb-6 text-2xl font-semibold text-gray-800">
          {job ? 'Chỉnh sửa Công việc' : 'Thêm Công việc mới'}
        </h2>

        {/* Form đã được type-safe */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Cột 1 */}
          <div className="flex flex-col gap-5">
            {/* Tiêu đề */}
            <div>
              <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-gray-700">
                Tiêu đề
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {/* Loại hình */}
            <div>
              <label htmlFor="type" className="mb-1.5 block text-sm font-medium text-gray-700">
                Loại hình
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="Toàn thời gian">Toàn thời gian</option>
                <option value="Bán thời gian">Bán thời gian</option>
                <option value="Khác">Khác</option>
              </select>
            </div>
            {/* Địa điểm */}
            <div>
              <label htmlFor="location" className="mb-1.5 block text-sm font-medium text-gray-700">
                Địa điểm
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="flex flex-col gap-5">
            {/* Hạn nộp */}
            <div>
              <label htmlFor="deadline" className="mb-1.5 block text-sm font-medium text-gray-700">
                Hạn nộp (dd/mm/yyyy)
              </label>
              <input
                type="text"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                placeholder="VD: 30/12/2024"
                className="w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            {/* Lương */}
            <div>
              <label htmlFor="salary" className="mb-1.5 block text-sm font-medium text-gray-700">
                Mức lương
              </label>
              <input
                type="text"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="VD: 15 - 20 triệu"
                disabled={formData.isNegotiable}
                className="w-full rounded-lg border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            {/* Thương lượng */}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="isNegotiable"
                name="isNegotiable"
                checked={formData.isNegotiable}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
              />
              <label htmlFor="isNegotiable" className="ml-2 block text-sm font-medium text-gray-700">
                Có thể thương lượng
              </label>
            </div>
          </div>

          {/* Nút Bấm */}
          <div className="col-span-1 mt-4 flex justify-end md:col-span-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="mr-3 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                'Lưu lại'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Component Modal Xác nhận Xóa
const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Xác nhận Xóa
        </h3>
        <p className="mb-6 text-sm text-gray-600">
          Bạn có chắc chắn muốn xóa công việc này không? Hành động này không thể
          hoàn tác.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex items-center justify-center rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:bg-red-400"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              'Xác nhận Xóa'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. COMPONENT CHÍNH ---

export default function JobManagementPage() {
  // State cho dữ liệu (đã được type)
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho Modal Thêm/Sửa (đã được type)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState<JobFormData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // State cho Modal Xóa (đã được type)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const API_URL = '/jobs'; // Route API (ví dụ: /api/jobs)
  const router = useRouter();

  // Hàm fetch danh sách jobs (đã cập nhật API thật)
  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get<Job[]>(API_URL);
      setJobs(response.data);
    } catch (err: unknown) {
      console.error('Lỗi fetch jobs:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Không thể tải dữ liệu công việc.');
      } else {
        setError('Đã xảy ra lỗi không xác định.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch jobs khi component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // --- Xử lý Modal Thêm/Sửa ---
  const handleOpenAddModal = () => {
    setCurrentJob(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setCurrentJob(job); // job đầy đủ (có _id)
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentJob(null);
  };

  // Hàm Lưu (Thêm/Sửa) - (đã cập nhật API thật)
  const handleSaveJob = async (formData: JobFormData) => {
    setIsSaving(true);
    setError(null);
    try {
      if (currentJob && currentJob._id) {
        // --- Chế độ Sửa (PUT) ---
        const response = await axiosClient.put<{ job: Job }>(
          `${API_URL}/${currentJob._id}`,
          formData
        );
        // Cập nhật lại list job trong state
        setJobs(jobs.map(job =>
          (job._id === currentJob._id ? response.data.job : job)
        ));
      } else {
        // --- Chế độ Thêm (POST) ---
        const response = await axiosClient.post<{ job: Job }>(API_URL, formData);
        // Thêm job mới vào đầu danh sách
        setJobs([response.data.job, ...jobs]);
      }
      handleCloseModal();
    } catch (err: unknown) {
      console.error('Lỗi lưu job:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Lưu thất bại. Vui lòng thử lại.');
      } else {
        setError('Đã xảy ra lỗi không xác định khi lưu.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // --- Xử lý Modal Xóa ---
  const handleOpenDeleteModal = (job: Job) => {
    setJobToDelete(job);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setJobToDelete(null);
  };

  // Hàm Xác nhận Xóa - (đã cập nhật API thật)
  const handleConfirmDelete = async () => {
    if (!jobToDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      // --- Gọi API Xóa (DELETE) ---
      await axiosClient.delete(`${API_URL}/${jobToDelete._id}`);
      // Xóa job khỏi state
      setJobs(jobs.filter((job) => job._id !== jobToDelete._id));
      handleCloseDeleteModal();
    } catch (err: unknown) {
      console.error('Lỗi xóa job:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Xóa thất bại. Vui lòng thử lại.');
      } else {
        setError('Đã xảy ra lỗi không xác định khi xóa.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  // --- Xử lý Chi tiết --- (đã cập nhật router)
  const handleViewDetails = (job: Job) => {
    // Tạo slug-like "ten-cong-viec-123"
    const slug = slugify(job.title, { lower: true, strict: true });

    router.push(`/jobs/${slug}-${job.jobID}`); // Điều hướng đến trang chi tiết
  };

  return (
    // Thêm padding cho trang
    <div className="">
      {/* Header của trang */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Tuyển dụng</h1>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
        >
          <Plus size={18} />
          <span>Thêm Job mới</span>
        </button>
      </div>

      {/* Thông báo Lỗi (nếu có) */}
      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Bảng dữ liệu */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Tiêu đề
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Loại hình
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Địa điểm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Mức lương
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hạn nộp
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Dùng map với job đã được type */}
                {jobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-medium text-2sm text-gray-900">{job.title}</span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          job.type === 'Full-time'
                            ? 'bg-blue-300 text-blue-800'
                            : job.type === 'Part-time'
                            ? 'bg-green-300 text-green-800'
                            : 'bg-gray-300 text-gray-800'
                        }`}
                      >
                        {job.type}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {job.location}
                    </td>
                    <td className="whitespace-nowrap px-2 py-4 text-sm text-gray-500">
                      {job.isNegotiable ? (
                        <span className="italic">Thương lượng</span>
                      ) : (
                        job.salary
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {job.deadline}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          title="Xem chi tiết"
                          onClick={() => handleViewDetails(job)}
                          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          title="Chỉnh sửa"
                          onClick={() => handleOpenEditModal(job)}
                          className="rounded-md p-1.5 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-800"
                        >
                          <FileEdit size={18} />
                        </button>
                        <button
                          title="Xóa"
                          onClick={() => handleOpenDeleteModal(job)}
                          className="rounded-md p-1.5 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                Không có công việc nào để hiển thị.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Thêm/Sửa */}
      <JobModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveJob}
        job={currentJob}
        isLoading={isSaving}
      />

      {/* Modal Xác nhận Xóa */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
}
