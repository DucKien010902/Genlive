"use client";
import axios from "@/config/apiconfig"; // Đã sửa: Thay thế alias bằng axios
import {
  Calendar,
  Clock,
  Edit,
  Info,
  Loader2,
  Mail,
  MapPin,
  Plus,
  Save,
  Smartphone,
  Trash2,
  User,
  Wallet,
  X
} from "lucide-react";
// Đã sửa: Xóa 'useParams' từ 'next/navigation'
import React, { useEffect, useState } from "react";

const PRIMARY_COLOR = "#b6202b";

// --- 1. ĐỊNH NGHĨA CÁC KIỂU DỮ LIỆU ---

interface JobMeta {
  _id?: string; // Thêm _id cho React key
  icon: string;
  text: string;
}

interface JobInfo {
  salary: string;
  bonus: string;
  classify: string;
  timework: string;
  place: string;
}

interface JobReference {
  _id?: string; // Thêm _id cho React key
  label: string;
  url: string;
  linkText: string;
}

interface JobContact {
  person: string;
  email: string;
  mobile: string;
  phone: string;
}

// Interface chính cho JobDetail
interface JobDetailType {
  _id?: string;
  jobID?: number;
  title: string;
  meta: JobMeta[];
  info: JobInfo;
  descriptionTitle: string;
  description: string[];
  requirementsTitle: string;
  requirements: string[];
  benefitsTitle: string;
  benefits: string[];
  referenceTitle: string;
  references: JobReference[];
  contactTitle: string;
  contact: JobContact;
}

// Các key của JobDetailType là một mảng string (để dùng cho list)
type JobDetailListKey = 'description' | 'requirements' | 'benefits';

// --- 2. COMPONENTS CON (ĐÃ THÊM TYPING) ---

// Props cho EditableField
interface EditableFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  value: string | undefined; // Cho phép undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isEditing: boolean;
  className?: string;
  as?: "input" | "textarea";
}

const EditableField: React.FC<EditableFieldProps> = ({
  value,
  onChange,
  isEditing,
  className = "",
  as = "input",
  ...props
}) => {
  if (!isEditing) {
    return as === "textarea" ? (
      <span className={`text-gray-700 leading-relaxed ${className}`}>
        {value}
      </span>
    ) : (
      <span className={`font-semibold text-gray-800 text-base ${className}`}>
        {value}
      </span>
    );
  }

  const baseClasses = "w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500";
  if (as === "textarea") {
    return (
      <textarea
        value={value}
        onChange={onChange}
        className={`${baseClasses} min-h-[100px] leading-relaxed`}
        {...props}
      />
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`${baseClasses} text-base`}
      {...props}
    />
  );
};


// Props cho SectionHeader
interface SectionHeaderProps {
  value: string | undefined; // Cho phép undefined
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isEditing: boolean;
  name: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ value, onChange, isEditing, name }) => (
  <h2
    className="text-xl font-bold mb-4 pt-8 md:pt-10 border-b pb-1"
    style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
  >
    {isEditing ? (
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border-b-2 border-dashed border-red-300 bg-red-50 px-2 py-1 text-xl font-bold text-red-800"
      />
    ) : (
      value
    )}
  </h2>
);

// Props cho EditableList
interface EditableListProps {
  items: string[] | undefined; // Cho phép undefined
  isEditing: boolean;
  listName: JobDetailListKey; // Sử dụng type đã định nghĩa
  onItemChange: (listName: JobDetailListKey, index: number, value: string) => void;
  onItemAdd: (listName: JobDetailListKey) => void;
  onItemRemove: (listName: JobDetailListKey, index: number) => void;
}

const EditableList: React.FC<EditableListProps> = ({
  items,
  isEditing,
  listName,
  onItemChange,
  onItemAdd,
  onItemRemove,
}) => {
  return (
    <ul className="list-none space-y-3 pl-0">
      {items?.map((item: string, index: number) => (
        <li
          key={index}
          className="flex items-start text-gray-700 leading-relaxed"
        >
          <span
            className="mr-3 font-bold text-lg"
            style={{ color: PRIMARY_COLOR }}
          >
            -
          </span>
          <div className="flex-grow">
            {isEditing ? (
              <textarea
                value={item}
                onChange={(e) => onItemChange(listName, index, e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            ) : (
              <span>{item}</span>
            )}
          </div>
          {isEditing && (
            <button
              onClick={() => onItemRemove(listName, index)}
              className="ml-2 p-1 text-red-500 hover:text-red-700"
              title="Xóa mục này"
            >
              <Trash2 size={16} />
            </button>
          )}
        </li>
      ))}
      {isEditing && (
        <button
          onClick={() => onItemAdd(listName)}
          className="mt-3 flex items-center space-x-1 rounded-md bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 hover:bg-green-200"
        >
          <Plus size={16} />
          <span>Thêm mục</span>
        </button>
      )}
    </ul>
  );
};

// --- 3. COMPONENT CHÍNH (ĐÃ THÊM TYPING) ---

const JobPostingFull: React.FC = () => {
  // Đã sửa: Dùng 'window.location' để lấy slug, vì 'useParams' không hoạt động
  const [slug, setSlug] = useState<string | undefined>(undefined);
  useEffect(() => {
    // Đảm bảo code này chỉ chạy ở client-side
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const parts = pathname.split('/');
      setSlug(parts[parts.length - 1]);
    }
  }, []);

  const jobID = slug ? slug.split("-").pop() : undefined;

  // State (đã type)
  const [jobData, setJobData] = useState<JobDetailType | null>(null);
  const [originalJobData, setOriginalJobData] = useState<JobDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm gọi API (đã type)
  const getJobData = async () => {
    if (!jobID) {
      setError("Không tìm thấy Job ID từ URL.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get<JobDetailType>(`/jobdetail/${jobID}`); // Đã sửa: dùng axios
      setJobData(res.data);
      setOriginalJobData(res.data);
    } catch (error: unknown) { // Thêm type unknown
      console.error("❌ Cannot get jobdetail:", error);
      // Giả sử error là một object có response.data.message
      const errorMessage = (error as any)?.response?.data?.message || "Không thể tải dữ liệu công việc. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (jobID) { // Thêm điều kiện check
      getJobData();
    }
  }, [jobID]); // Chạy lại khi jobID thay đổi (thay vì getJobData)

  // --- HÀM XỬ LÝ FORM (ĐÃ THÊM TYPING) ---

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".") as [keyof JobDetailType, string];

      if (parent === 'info' || parent === 'contact') {
        setJobData((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: value,
            },
          };
        });
      }
    } else {
      setJobData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          [name as keyof JobDetailType]: value,
        };
      });
    }
  };

  const handleMetaChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // name sẽ là 'text'
    setJobData((prev) => {
      if (!prev) return null;
      const newMeta = [...(prev.meta || [])];
      // Giả định name là 'text'
      if (name === 'text') {
        newMeta[index] = { ...newMeta[index], text: value };
      }
      return { ...prev, meta: newMeta };
    });
  };

  const handleListChange = (listName: JobDetailListKey, index: number, value: string) => {
    setJobData((prev) => {
      if (!prev) return null;
      const newList = [...(prev[listName] || [])]; // Thêm fallback
      newList[index] = value;
      return { ...prev, [listName]: newList };
    });
  };

  const handleListAddItem = (listName: JobDetailListKey) => {
    setJobData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [listName]: [...(prev[listName] || []), "Nội dung mới..."], // Thêm fallback
      };
    });
  };

  const handleListRemoveItem = (listName: JobDetailListKey, index: number) => {
    setJobData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [listName]: (prev[listName] || []).filter((_, i) => i !== index), // Thêm fallback
      };
    });
  };

  // --- HÀM XỬ LÝ NÚT BẤM (ĐÃ THÊM TYPING) ---

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setJobData(originalJobData);
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (!jobID || !jobData) return; // Thêm check jobData

    setIsSaving(true);
    setError(null);

    try {
      const { _id, ...payload } = jobData;
      // Kiểu response mong đợi
      type UpdateResponse = {
        job: JobDetailType;
      }
      const res = await axios.put<UpdateResponse>(`/jobdetail/${jobID}`, payload); // Đã sửa: dùng axios
      setJobData(res.data.job);
      setOriginalJobData(res.data.job);
      setIsEditing(false);
    } catch (error: unknown) { // Thêm type unknown
      console.error("❌ Cannot update jobdetail:", error);
      const errorMessage = (error as any)?.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };


  // --- RENDER ---

  if (isLoading) {
    return (
      <div style={{ minHeight: 600 }} className="flex items-center justify-center">
        <Loader2 size={40} className="animate-spin" style={{ color: PRIMARY_COLOR }} />
      </div>
    );
  }

  if (error) {
    return <div style={{ minHeight: 600 }} className="flex items-center justify-center text-red-600">{error}</div>;
  }

  if (!jobData) {
    return <div style={{ minHeight: 600 }}>Không có dữ liệu công việc.</div>;
  }

  const {
    title,
    meta,
    info,
    descriptionTitle,
    description,
    requirementsTitle,
    requirements,
    benefitsTitle,
    benefits,
    contactTitle,
    contact,
  } = jobData;

  return (
    <div
      className="min-h-screen w-full flex justify-center items-start pt-12 pb-12"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20250607/original/pngtree-red-and-white-abstract-background-template-design-vector-picture-image_16630261.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}
    >
      <div
        className="relative w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 border"
        style={{ borderColor: PRIMARY_COLOR + "33" }}
      >
        {/* Nút Sửa/Lưu/Hủy */}
        <div className="absolute top-4 right-4 flex space-x-2 z-10"> {/* Thêm z-10 */}
          {isEditing ? (
            <>
              <button
                onClick={handleCancelClick}
                disabled={isSaving}
                className="flex items-center space-x-1.5 rounded-lg bg-gray-200 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-300 disabled:opacity-50"
              >
                <X size={16} />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleSaveClick}
                disabled={isSaving}
                className="flex items-center space-x-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
              >
                {isSaving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}
                <span>Lưu</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleEditClick}
              className="flex items-center space-x-1.5 rounded-lg bg-gray-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              <Edit size={16} />
              <span>Chỉnh sửa</span>
            </button>
          )}
        </div>

        {/* Header */}
        <header
          className="mb-8 border-b pb-4 pr-32" // Thêm pr để nút Sửa không đè lên
          style={{ borderColor: PRIMARY_COLOR + "55" }}
        >
          {isEditing ? (
            <input
              name="title"
              value={title}
              onChange={handleChange}
              className="w-full border-b-2 border-dashed border-red-300 bg-red-50 px-2 py-1 text-2xl sm:text-3xl font-bold uppercase text-red-800"
            />
          ) : (
            <h1
              className="text-2xl sm:text-3xl font-bold uppercase leading-tight"
              style={{ color: PRIMARY_COLOR }}
            >
              {title}
            </h1>
          )}

          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            {meta?.map((item, index) => (
              <div key={item._id || index} className="flex items-center space-x-1.5">
                <Info size={14} className="text-gray-400"/>
                {isEditing ? (
                  <input
                    name="text"
                    value={item.text}
                    onChange={(e) => handleMetaChange(index, e)}
                    className="w-full rounded-md border border-gray-300 px-2 py-0.5 text-sm shadow-sm"
                  />
                ) : (
                  <span>{item.text}</span>
                )}
              </div>
            ))}
          </div>
        </header>

        {/* Info */}
        <section className="mb-10">
          <h2
            className="text-xl sm:text-2xl font-bold mb-4"
            style={{ color: PRIMARY_COLOR }}
          >
            Thông tin công việc
          </h2>
          <div
            className="bg-white rounded-lg sm:border p-0 sm:p-4"
            style={{ borderColor: PRIMARY_COLOR + "33" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
              {/* Mức lương */}
              <div className="flex space-x-3">
                <Wallet size={20} className="mt-1 text-gray-400"/>
                <div className="flex-grow">
                  <span className="text-sm text-gray-500">Mức lương:</span>
                  <EditableField
                    name="info.salary"
                    value={info?.salary}
                    onChange={handleChange}
                    isEditing={isEditing}
                    className="block"
                  />
                </div>
              </div>
              {/* Thưởng */}
              <div className="flex space-x-3">
                <Wallet size={20} className="mt-1 text-gray-400"/>
                <div className="flex-grow">
                  <span className="text-sm text-gray-500">Thưởng:</span>
                  <EditableField
                    name="info.bonus"
                    value={info?.bonus}
                    onChange={handleChange}
                    isEditing={isEditing}
                    className="block"
                  />
                </div>
              </div>
              {/* Loại hình */}
              <div className="flex space-x-3">
                <Calendar size={20} className="mt-1 text-gray-400"/>
                <div className="flex-grow">
                  <span className="text-sm text-gray-500">Loại hình:</span>
                  <EditableField
                    name="info.classify"
                    value={info?.classify}
                    onChange={handleChange}
                    isEditing={isEditing}
                    className="block"
                  />
                </div>
              </div>
              {/* Thời gian làm việc */}
              <div className="flex space-x-3">
                <Clock size={20} className="mt-1 text-gray-400"/>
                <div className="flex-grow">
                  <span className="text-sm text-gray-500">Thời gian làm việc:</span>
                  <EditableField
                    name="info.timework"
                    value={info?.timework}
                    onChange={handleChange}
                    isEditing={isEditing}
                    className="block"
                  />
                </div>
              </div>
              {/* Địa điểm */}
              <div className="flex space-x-3">
                <MapPin size={20} className="mt-1 text-gray-400"/>
                <div className="flex-grow">
                  <span className="text-sm text-gray-500">Địa điểm:</span>
                  <EditableField
                    name="info.place"
                    value={info?.place}
                    onChange={handleChange}
                    isEditing={isEditing}
                    className="block"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="mb-10">
          <SectionHeader
            value={descriptionTitle}
            onChange={handleChange}
            isEditing={isEditing}
            name="descriptionTitle"
          />
          <EditableList
            items={description}
            isEditing={isEditing}
            listName="description"
            onItemChange={handleListChange}
            onItemAdd={handleListAddItem}
            onItemRemove={handleListRemoveItem}
          />
        </section>

        {/* Requirements */}
        <section className="mb-10">
          <SectionHeader
            value={requirementsTitle}
            onChange={handleChange}
            isEditing={isEditing}
            name="requirementsTitle"
          />
          <EditableList
            items={requirements}
            isEditing={isEditing}
            listName="requirements"
            onItemChange={handleListChange}
            onItemRemove={handleListRemoveItem}
            onItemAdd={handleListAddItem}
          />
        </section>

        {/* Benefits */}
        <section className="mb-10">
          <SectionHeader
            value={benefitsTitle}
            onChange={handleChange}
            isEditing={isEditing}
            name="benefitsTitle"
          />
          <EditableList
            items={benefits}
            isEditing={isEditing}
            listName="benefits"
            onItemChange={handleListChange}
            onItemRemove={handleListRemoveItem}
            onItemAdd={handleListAddItem}
          />
        </section>

        {/* Contact */}
        <section className="mb-10">
          <SectionHeader
            value={contactTitle}
            onChange={handleChange}
            isEditing={isEditing}
            name="contactTitle"
          />
          <div
            className="bg-white rounded-lg border p-6"
            style={{ borderColor: PRIMARY_COLOR + "33" }}
          >
            <div className="grid grid-cols-1 gap-4">
              {/* Người phụ trách */}
              <div className="flex items-center space-x-3">
                <User size={18} className="text-gray-400"/>
                <span className="font-semibold text-base whitespace-nowrap">
                  Người phụ trách:
                </span>
                <EditableField
                  name="contact.person"
                  value={contact?.person}
                  onChange={handleChange}
                  isEditing={isEditing}
                />
              </div>

              {/* Grid 2 cột cho SĐT và Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* SĐT */}
                <div className="flex items-center space-x-3">
                  <Smartphone size={18} className="text-gray-400"/>
                  <span className="font-semibold text-base whitespace-nowrap">
                    SĐT di động:
                  </span>
                  <EditableField
                    name="contact.mobile"
                    value={contact?.mobile}
                    onChange={handleChange}
                    isEditing={isEditing}
                  />
                </div>
                {/* Email */}
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-gray-400"/>
                  <span className="font-semibold text-base whitespace-nowrap">
                    Email:
                  </span>
                  <EditableField
                    name="contact.email"
                    value={contact?.email}
                    onChange={handleChange}
                    isEditing={isEditing}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobPostingFull;
