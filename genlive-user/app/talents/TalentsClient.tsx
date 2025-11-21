"use client";
import axiosClient from "@/config/apiconfig";
import { Metadata } from "next";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

// Màu chủ đạo của thương hiệu
const PRIMARY_COLOR = "#b6202b";

// Cập nhật Interface để khớp với CSDL
interface Creator {
  _id: string;
  ID: number;
  name: string;
  handle: string;
  followers: number;
  category: string;
  imageUrl: string;
  description: string;
}

// --- Component Card với hiệu ứng "sóng" và "hover" ---
const CreatorCard: React.FC<{
  creator: Creator;
  onCardClick: (creator: Creator) => void;
  index: number;
}> = ({ creator, onCardClick, index }) => {
  return (
    <div
      className={`flex flex-col items-start text-start group cursor-pointer
        transition-transform duration-300 ease-in-out
        hover:-translate-y-2
        ${index % 2 === 0 ? "md:translate-y-3" : ""} 
      `}
      onClick={() => onCardClick(creator)}
    >
      <div className="relative w-full aspect-square rounded-2xl mb-3">
        <img
          src={creator.imageUrl}
          alt={creator.name}
          className="w-full h-full object-cover rounded-2xl relative z-10"
        />
        {/* Border hover đổi sang màu PRIMARY_COLOR */}
        <div
          className="absolute inset-0 -m-[3px] rounded-2xl border-4 border-transparent
            group-hover:border-[#b6202b] transition-all duration-300 z-20 pointer-events-none"
        ></div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-0.5">{creator.name}</h3>
      <p className="text-sm font-medium" style={{ color: PRIMARY_COLOR }}>
        {creator.handle}
      </p>
    </div>
  );
};

// --- Component Modal chi tiết ---
interface CreatorDetailModalProps {
  creator: Creator;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  prevName?: string;
  nextName?: string;
}

const CreatorDetailModal: React.FC<CreatorDetailModalProps> = ({
  creator,
  onClose,
  onNext,
  onPrev,
  prevName,
  nextName,
}) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 backdrop-blur-sm p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white shadow-xl w-full max-w-5xl
                  md:min-h-[80vh] max-h-[90vh] md:max-h-none
                  rounded-2xl md:rounded-[40px]
                  flex flex-col md:flex-row border border-gray-100
                  overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 md:top-5 md:right-6 text-gray-500 hover:text-gray-800 text-4xl font-light cursor-pointer z-10"
        >
          &times;
        </button>

        {/* Cột trái - Ảnh + Prev / Next */}
        <div className="flex flex-col items-center justify-between p-4 sm:p-6 md:p-8 w-full md:w-1/2 md:border-r border-gray-200">
          {/* Ảnh */}
          <div
            className="w-full max-w-xs aspect-square mx-auto
                        md:w-full md:max-w-none md:h-full md:aspect-auto
                        rounded-3xl overflow-hidden shadow-lg
                        border-4 border-[#b6202b]"
          >
            <img
              src={creator.imageUrl}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between w-full mt-6 md:mt-8">
            {/* PREV */}
            <div
              className="flex flex-col items-start font-semibold"
              style={{ color: PRIMARY_COLOR }}
            >
              <span
                className="text-sm font-bold text-gray-500 hover:underline cursor-pointer"
                onClick={onPrev}
              >
                PREV
              </span>
              <span className="mt-1 text-lg sm:text-xl">{prevName}</span>
            </div>

            {/* NEXT */}
            <div
              className="flex flex-col items-end font-semibold"
              style={{ color: PRIMARY_COLOR }}
            >
              <span
                className="text-sm font-bold text-gray-500 hover:underline cursor-pointer"
                onClick={onNext}
              >
                NEXT
              </span>
              <span className="mt-1 text-lg sm:text-xl">{nextName}</span>
            </div>
          </div>
        </div>

        {/* Cột phải - Nội dung */}
        <div className="p-4 sm:p-6 md:p-10 w-full md:w-1/2 flex flex-col text-center md:text-left">
          {/* Tiêu đề & Handle (Cố định) */}
          <div className="flex-shrink-0">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
              {creator.name}
            </h2>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <p
                className="text-lg sm:text-xl font-semibold mb-0"
                style={{ color: PRIMARY_COLOR }}
              >
                {creator.handle}
              </p>
              <p
                className="text-lg sm:text-xl font-semibold mb-6 mr-0"
                style={{ color: PRIMARY_COLOR }}
              >
                Followers: {(creator.followers) / 1000}K
              </p>
            </div>
          </div>

          {/* Vùng mô tả có thể cuộn */}
          <div className="flex-grow overflow-y-auto pr-2 md:max-h-[59vh]">
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed whitespace-pre-line text-justify">
              {creator.description}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- Component hiệu ứng nền (Orbs) ---
const DecorativeOrbs = () => {
  const orbBaseStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    borderRadius: "50%",
    backgroundImage: `radial-gradient(${PRIMARY_COLOR} 2px, transparent 3px)`,
    backgroundSize: "12px 12px",
    opacity: 0.1,
    animation: "spin 60s linear infinite",
    zIndex: 0,
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden hidden lg:block"
      aria-hidden="true"
    >
      {/* Left Orbs */}
      <div
        style={{
          ...orbBaseStyle,
          width: "300px",
          height: "300px",
          left: 0,
          transform: "translate(-50%, -50%)",
          animationDuration: "40s",
          opacity: 0.15,
        }}
      ></div>
      <div
        style={{
          ...orbBaseStyle,
          width: "400px",
          height: "400px",
          left: 0,
          transform: "translate(-50%, -50%)",
          animationDuration: "50s",
          opacity: 0.1,
        }}
      ></div>
      <div
        style={{
          ...orbBaseStyle,
          width: "500px",
          height: "500px",
          left: 0,
          transform: "translate(-50%, -50%)",
          animationDuration: "60s",
          opacity: 0.05,
        }}
      ></div>

      {/* Right Orbs */}
      <div
        style={{
          ...orbBaseStyle,
          width: "300px",
          height: "300px",
          right: 0,
          left: "auto",
          transform: "translate(50%, -50%)",
          animationName: "spin-right",
          animationDuration: "45s",
          opacity: 0.15,
        }}
      ></div>
      <div
        style={{
          ...orbBaseStyle,
          width: "400px",
          height: "400px",
          right: 0,
          left: "auto",
          transform: "translate(50%, -50%)",
          animationName: "spin-right",
          animationDuration: "55s",
          opacity: 0.1,
        }}
      ></div>
      <div
        style={{
          ...orbBaseStyle,
          width: "500px",
          height: "500px",
          right: 0,
          left: "auto",
          transform: "translate(50%, -50%)",
          animationName: "spin-right",
          animationDuration: "65s",
          opacity: 0.05,
        }}
      ></div>
    </div>
  );
};

// --- Component chính ---
type Page = "home" | "blog" | "talents" | "contact";
interface LibraryPageProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}
export const metadata: Metadata = {
  title: "GENLIVE Talents - Discover Top Creators",
  description: "Explore and connect with talented creators on GenLive.vn, a leading livestream and digital content platform.",
  keywords: "GenLive, talents, creators, livestream, digital content",
  icons: { icon: "/G-live-2000px.png" },
};
export default function Library() {
  const searchParam = useSearchParams();
  
  // State lưu danh sách creators từ API
  const [initialCreators, setInitialCreators] = useState<Creator[]>([]);
  // State lưu danh sách các category (được trích xuất động)
  const [categories, setCategories] = useState<string[]>([]);
  // State lưu category đang active
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const getTalents = async () => {
    try {
      const res = await axiosClient.get("/talents");
      const data: Creator[] = res.data;
      setInitialCreators(data);

      // ⭐️ TRÍCH XUẤT DANH MỤC ĐỘNG TỪ DỮ LIỆU
      // 1. Lấy tất cả category
      const allCategories = data.map(item => item.category);
      // 2. Lọc trùng bằng Set và convert lại mảng
      const uniqueCategories = Array.from(new Set(allCategories));
      // 3. Sắp xếp (tùy chọn, ví dụ alpha b)
      uniqueCategories.sort();

      setCategories(uniqueCategories);

      // ⭐️ Thiết lập activeCategory mặc định
      // Nếu URL có param -> dùng param
      // Nếu không -> dùng category đầu tiên trong danh sách vừa lấy được
      const paramCategory = searchParam?.get("category");
      if (paramCategory && uniqueCategories.includes(paramCategory)) {
        setActiveCategory(paramCategory);
      } else if (uniqueCategories.length > 0) {
        setActiveCategory(uniqueCategories[0]);
      }

    } catch (error) {
      console.log("Cannot get data", error);
    }
  };

  useEffect(() => {
    getTalents();
  }, []);

  // Lọc danh sách theo activeCategory
  const filteredCreators = useMemo(() => {
    if (!activeCategory) return [];
    return initialCreators.filter((c) => c.category === activeCategory);
  }, [initialCreators, activeCategory]);

  const handleCardClick = (creator: Creator) => {
    const index = filteredCreators.findIndex((c) => c._id === creator._id);
    setSelectedIndex(index);
  };

  const handleCloseModal = () => setSelectedIndex(null);

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) => (prev! + 1) % filteredCreators.length);
  };

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(
      (prev) => (prev! - 1 + filteredCreators.length) % filteredCreators.length,
    );
  };

  const selectedCreator =
    selectedIndex !== null ? filteredCreators[selectedIndex] : null;

  const prevName =
    selectedIndex !== null
      ? filteredCreators[
          (selectedIndex - 1 + filteredCreators.length) %
            filteredCreators.length
        ].name
      : "";

  const nextName =
    selectedIndex !== null
      ? filteredCreators[(selectedIndex + 1) % filteredCreators.length].name
      : "";

  return (
    <div className="min-h-screen bg-white py-12 relative overflow-x-clip">
      <DecorativeOrbs />

      <style jsx global>{`
        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes spin-right {
          from { transform: translate(50%, -50%) rotate(0deg); }
          to { transform: translate(50%, -50%) rotate(360deg); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Tiêu đề */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 tracking-widest text-gray-900 mt-24">
          TALENT TEAMS
        </h1>

        {/* Tabs (Dynamic Categories) */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-12 mt-10">
          {/* Render danh sách category động */}
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedIndex(null);
                }}
                className={`py-2 px-6 sm:px-10 w-[160px] sm:w-auto text-base sm:text-xl rounded-full font-bold transition-all duration-300
                  ${
                    isActive
                      ? "text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-500 hover:text-gray-900"
                  }`}
                style={{
                  backgroundColor: isActive ? PRIMARY_COLOR : undefined,
                  boxShadow: isActive
                    ? `0 6px 15px ${PRIMARY_COLOR}80`
                    : "none",
                }}
              >
                {/* Hiển thị tên category (bạn có thể mapping tên đẹp hơn nếu cần) */}
                {cat} 
              </button>
            );
          })}
        </div>

        {/* Danh sách Cards */}
        <div className="relative grid justify-center justify-items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
          {filteredCreators.map((creator, index) => (
            <CreatorCard
              key={creator._id}
              creator={creator}
              onCardClick={handleCardClick}
              index={index}
            />
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <p
            className="text-center text-5xl mt-10"
            style={{ fontFamily: "cursive", fontWeight: 700, color: PRIMARY_COLOR }}
          >
            {initialCreators.length === 0 ? "Loading..." : "Coming Soon!"}
          </p>
        )}
      </div>

      {/* Modal */}
      {selectedCreator && (
        <CreatorDetailModal
          creator={selectedCreator}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
          prevName={prevName}
          nextName={nextName}
        />
      )}
    </div>
  );
}