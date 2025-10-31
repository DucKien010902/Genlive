"use client";
import axiosClient from "@/config/apiconfig";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

// Màu chủ đạo của thương hiệu
const PRIMARY_COLOR = "#b6202b";

const categories = [
  { key: "Fashion", label: "Fashion" },
  { key: "Beauty", label: "Beauty" },
  { key: "Entertainment", label: "Entertainment" },
  { key: "E-Commerce", label: "E-Commerce" },
  { key: "Top-Idols", label: "Top-Idols" },
];

interface Creator {
  ID: number;
  name: string;
  handle: string;
  category: string;
  imageUrl: string;
  description: string;
}

// --- Component Card với hiệu ứng "sóng" và "hover" ---
const CreatorCard: React.FC<{
  creator: Creator;
  onCardClick: (creator: Creator) => void;
  index: number; // ⭐️ Thêm index để tính hiệu ứng sóng
}> = ({ creator, onCardClick, index }) => {
  return (
    <div
      className={`flex flex-col items-start text-start group cursor-pointer
        transition-all duration-300 ease-in-out
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#b6202b]/30
        ${
          index % 2 === 0 ? "md:translate-y-3" : ""
        } // ⭐️ HIỆU ỨNG SÓNG: item chẵn bị đẩy xuống
      `}
      onClick={() => onCardClick(creator)}
    >
      <div className="relative w-full aspect-square rounded-2xl mb-3 shadow-md">
        <img
          src={creator.imageUrl}
          alt={creator.name}
          className="w-full h-full object-cover rounded-2xl relative z-10"
        />
        {/* ⭐️ Border hover đổi sang màu PRIMARY_COLOR */}
        <div
          className="absolute inset-0 -m-[3px] rounded-2xl border-4 border-transparent
            group-hover:border-[#b6202b] transition-all duration-300 z-20 pointer-events-none"
        ></div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-0.5">{creator.name}</h3>
      <p className="text-2sm font-medium" style={{ color: PRIMARY_COLOR }}>
        {creator.handle}
      </p>
    </div>
  );
};

// --- Component Modal chi tiết (Update màu) ---
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
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-50 backdrop-blur-sm p-4 sm:p-6" // Thêm backdrop-blur
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
                       border-4 border-[#b6202b]" // ⭐️ Update màu border
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
              style={{ color: PRIMARY_COLOR }} // ⭐️ Update màu chữ
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
              style={{ color: PRIMARY_COLOR }} // ⭐️ Update màu chữ
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
            <p
              className="text-lg sm:text-xl font-semibold mb-6"
              style={{ color: PRIMARY_COLOR }} // ⭐️ Update màu chữ
            >
              {creator.handle}
            </p>
          </div>

          {/* Vùng mô tả có thể cuộn */}
          <div className="flex-grow overflow-y-auto pr-2 md:max-h-[59vh]">
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed whitespace-pre-line">
              {creator.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ⭐️ Component hiệu ứng nền (Orbs) ---
const DecorativeOrbs = () => {
  const orbBaseStyle: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    borderRadius: "50%",
    // Tạo hiệu ứng chấm bi bằng gradient
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

// --- Component chính (Update Tab, Grid) ---
type Page = "home" | "blog" | "talents" | "contact";
interface LibraryPageProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

export default function Library({ setCurrentPage }: LibraryPageProps) {
  const searchParam= useSearchParams()
  const [activeCategory, setActiveCategory] = useState(searchParam?.get('category')||"Fashion");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [initialCreators, setInitialCreators] = useState<Creator[]>([]);

  const getTalents = async () => {
    try {

      const res = await axiosClient.get("/talents");
      setInitialCreators(res.data);
    } catch (error) {
      console.log("Cannot get data", error);
    }
  };

  useEffect(() => {
    getTalents();
  }, []);

  const filteredCreators = initialCreators.filter(
    (c) => c.category === activeCategory,
  );

  const handleCardClick = (creator: Creator) => {
    const index = filteredCreators.findIndex((c) => c.ID == creator.ID);
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
    // ⭐️ Thêm relative và overflow-x-clip
    <div className="min-h-screen bg-white py-12 relative overflow-x-clip">
      {/* ⭐️ Thêm component hiệu ứng Orbs */}
      <DecorativeOrbs />

      {/* ⭐️ Thêm CSS cho animation (cần thiết cho DecorativeOrbs) */}
      <style jsx global>{`
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        @keyframes spin-right {
          from {
            transform: translate(50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(50%, -50%) rotate(360deg);
          }
        }
      `}</style>

      {/* ⭐️ Thêm relative và z-10 để nội dung nổi lên trên */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Tiêu đề */}
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center mb-8 tracking-widest text-gray-900 mt-24">
          TALENT GROUPS
        </h1>

        {/* Tabs (Update màu sắc) */}
        <div className="flex justify-center flex-wrap gap-2 sm:gap-3 mb-12 mt-10">
          {categories.map((category) => {
            const isActive = category.key === activeCategory;
            return (
              <button
                key={category.key}
                onClick={() => {
                  setActiveCategory(category.key);
                  setSelectedIndex(null);
                }}
                className={`py-2 px-6 sm:px-10 w-[160px] sm:w-auto text-base sm:text-xl rounded-full font-bold transition-all duration-300
                  ${
                    isActive
                      ? "text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-500 hover:text-gray-900"
                  }`}
                // ⭐️ Style động để dùng biến PRIMARY_COLOR
                style={{
                  backgroundColor: isActive ? PRIMARY_COLOR : undefined,
                  boxShadow: isActive
                    ? `0 6px 15px ${PRIMARY_COLOR}80` // 80 là độ mờ
                    : "none",
                }}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Danh sách (Update Grid) */}
        {/* ⭐️ Thêm class 'relative' cho grid để 'sóng' không bị cắt */}
        <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10">
          {filteredCreators.map((creator, index) => (
            <CreatorCard
              key={creator.ID}
              creator={creator}
              onCardClick={handleCardClick}
              index={index} // ⭐️ Truyền index vào Card
            />
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <p className="text-center text-5xl  mt-10" style={{fontFamily:'cursive', fontWeight:700, color:PRIMARY_COLOR}}>
            Coming Soon!
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
