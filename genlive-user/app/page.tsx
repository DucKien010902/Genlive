"use client";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BsGraphUpArrow } from "react-icons/bs";
import { CiStar } from "react-icons/ci";
import { GiDirectorChair } from "react-icons/gi";
import { PiYoutubeLogoThin } from "react-icons/pi";
// Hoặc sử dụng 'ai' (Ant Design) hoặc 'io' (Ionicons) tùy thuộc vào lựa chọn của bạn
// --- MOCK DATA ---
interface Idol {
  id: number;
  name: string;
  handle: string;
  followers: string;
  category: string;
  description: string;
  imageUrl: string;
}

const IDOLS: Idol[] = [
  {
    id: 1,
    name: "Team Aries – The Fire of Beginning",
    handle: "Male Talent Group",
    followers: "Passionate • Bold • Confident • Inspiring",
    category: "Team Aries",
    imageUrl:
      'https://res.cloudinary.com/da6f4dmql/image/upload/v1762769169/Idol_Nam_bgffie.png',
    description: `
    Aries is the call of the pioneers — the brave souls who dare to begin, to lead, to create something new.
    Our male talents embody courage, confidence, and unstoppable energy.
    Every livestream becomes their stage, where fire turns into feeling and performance turns into connection.
    They don’t just perform — they ignite.
    Their spirit fuels GENLIVE’s creative heartbeat, symbolizing the spark of every journey that starts with belief and passion.
    `,
  },
  {
    id: 2,
    name: "Team Taurus – The Power of Grounded Grace",
    handle: "Female Talent Group",
    followers: "Steady • Elegant • Empathetic • Artistic",
    category: "Team Taurus",
    imageUrl:
      "https://res.cloudinary.com/da6f4dmql/image/upload/v1762769394/Idol_Nu_dhnsmi.png",
    description: `
    Taurus represents strength through serenity — beauty that comes from calm determination and inner confidence.
    Our female talents carry that same grounded elegance.
    They are the soft rhythm beneath the fire — steady, graceful, and full of heart.
    Their livestreams feel like art in motion — moments of honesty, warmth, and emotional depth.
    Taurus doesn’t just entertain; they remind us of what truly connects people: trust, empathy, and authenticity.
    `,
  },
];



const TSP_SERVICES = [
  {
    title: "Livestream Planning",
    description: "Concept & Script",
    icon: <PiYoutubeLogoThin style={{ fontSize: 50 }} />,
  },
  {
    title: "Host & Talent Booking",
    description: "Casting",
    icon: <GiDirectorChair style={{ fontSize: 50 }} />,
  },
  {
    title: "Scene & Visual Setup",
    description: "Overlay Design",
    icon: <PiYoutubeLogoThin style={{ fontSize: 50 }} />,
  },
  {
    title: "Interactive Elements",
    description: "Mini Games",
    icon: <CiStar style={{ fontSize: 60 }} />,
  },
  {
    title: "Audience Engagement",
    description: "Chat Boost",
    icon: <BsGraphUpArrow style={{ fontSize: 50 }} />,
  },
  {
    title: "Livestream Direction",
    description: "Real-time Control",
    icon: <GiDirectorChair style={{ fontSize: 50 }} />,
  },
  {
    title: "Monetization Strategy",
    description: "Revenue Boost",
    icon: <BsGraphUpArrow style={{ fontSize: 50 }} />,
  },
  {
    title: "Performance Analytics",
    description: "Report",
    icon: <BsGraphUpArrow style={{ fontSize: 50 }} />,
  },

];

const TOP_BRANDS_DATA = [
  {
    name: "Coming Soon",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "Coming Soon",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "Coming Soon",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  { name: "Coming Soon", logo: "https://placehold.co/100x40/000/white?text=Coming Soon" },
  { name: "Coming Soon", logo: "https://placehold.co/100x40/000/white?text=Coming Soon" },
  {
    name: "Coming Soon",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "Coming Soon",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "Coming Soon",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  }, // Lặp lại để kéo dài
  { name: "Coming Soon", logo: "https://placehold.co/100x40/000/white?text=Coming Soon" },
  { name: "Coming Soon", logo: "https://placehold.co/100x40/000/white?text=Coming Soon" },
];

const BOTTOM_BRANDS_DATA = [
  {
    name: "The COOCON",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "TSUBAKI",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "Unilever",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  { name: "Bad B.", logo: "https://placehold.co/100x40/000/white?text=Coming Soon" },
  {
    name: "LEVENTS",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "Maybelline",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "L'Oreal",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "The COOCON",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  }, // Lặp lại để kéo dài
  {
    name: "TSUBAKI",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
  {
    name: "Unilever",
    logo: "https://placehold.co/100x40/000/white?text=Coming Soon",
  },
];

const STATS_DATA = [
  { value: "20+", label: "Active Talents" },
  { value: "360+", label: "Livestream Hours" },
  { value: "50+", label: "Livestreams/ Month" },
  { value: "20K+", label: "Views/ Month" },
  // { value: "10K+", label: "Engagement/Month" },
];

const PRIMARY_COLOR = "#b6202b";
const TEXT_DARK_COLOR = "#000000ff";

// --- 1. COMMON COMPONENTS: NAVBAR & UNDER DEVELOPMENT PAGE ---

type Page = "home" | "blog" | "talents" | "contact";

const UnderDevelopmentPage: React.FC<{ page: Page }> = ({ page }) => (
  <div className="min-h-screen pt-16 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-8">
    <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-2xl max-w-lg w-full transform transition-all duration-500 hover:scale-[1.02]">
      <span className="text-6xl mb-4 block animate-bounceSlow">🚧</span>
      <h1 className="text-4xl font-extrabold text-pink-600 mb-4">
        Trang {page.toUpperCase()}
      </h1>
      <p className="text-gray-700 dark:text-gray-300 text-lg">
        Rất tiếc, trang này hiện đang được chúng tôi phát triển.
      </p>
      <p className="text-gray-500 dark:text-gray-400 mt-2">
        Xin vui lòng quay lại sau để cập nhật những thông tin mới nhất!
      </p>
    </div>
  </div>
);

// --- 2. HOME PAGE SECTIONS ---

// Section 1: Full Screen Banner
// Giả định PRIMARY_COLOR đã được định nghĩa là 'rgb(255, 75, 107)'

const FullScreenBanner: React.FC = () => (
  // Dùng paddingBottom: 56.25% (tỉ lệ 9:16)
  <div
    className="relative w-full overflow-hidden"
    style={{ paddingBottom: "56.25%" }}
  >
    {/* 2. Inner container: Đặt tuyệt đối (absolute) để chứa nội dung video và text. */}
    <div
      // Cần pt-16 (64px) để nội dung bắt đầu dưới Navbar
      className="absolute inset-0 flex items-center justify-center pt-16 "
      style={{ top: 0 }}
    >
      {/* 1. Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/HEAD VIDEOGL.mp4" type="video/mp4" />
        Trình duyệt của bạn không hỗ trợ thẻ video.
      </video>

      {/* 2. Lớp phủ (Overlay) - Lớp phủ mờ đảm bảo chữ trắng của Nav dễ đọc */}
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundColor: TEXT_DARK_COLOR }}
      ></div>

      {/* 3. Text "GENLIVE SHOW" */}
      {/* <h1
                className="text-6xl sm:text-8xl md:text-9xl font-black text-center leading-tight tracking-widest z-10 animate-fadeIn"
                style={{
                    color: '#e60076',
                    textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 5px rgba(255, 255, 255, 0.6)'
                }}
            >
                GENLIVE
                <br />
                SHOW
            </h1> */}
    </div>
  </div>
);

// Section 2: Creators Carousel
const CreatorsCarousel: React.FC = () => {
  // Giả định các biến này đã được định nghĩa ở ngoài (PRIMARY_COLOR, TEXT_DARK_COLOR, IDOLS, useState, useMemo, useCallback)
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIdol = useMemo(() => IDOLS[currentIndex], [currentIndex]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % IDOLS.length);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + IDOLS.length) % IDOLS.length,
    );
  }, []);

  // Lấy Idol trước và sau để tạo hiệu ứng nền mờ (sử dụng index + 1 và index - 1)
  const prevIdolIndex = (currentIndex - 1 + IDOLS.length) % IDOLS.length;
  const nextIdolIndex = (currentIndex + 1) % IDOLS.length;
  const prevIdol = IDOLS[prevIdolIndex];
  const nextIdol = IDOLS[nextIdolIndex];
  const router= useRouter()
  return (
    <section className="relative py-6 sm:py-16 px-0 md:px-8 bg-white flex flex-col items-center">
      {/* Tiêu đề - CHỈNH SỬA KÍCH THƯỚC VÀ ĐỘ RỘNG */}
      <div className="text-center mb-0 sm:mb-12 w-full max-w-6xl sm:text-3xl">
        <p
          className="font-bold tracking-widest mb-2"
          style={{ color: PRIMARY_COLOR }}
        >
          OUR TALENT
        </p>
        <h2
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold max-w-9xl mx-auto"
          style={{ color: TEXT_DARK_COLOR }}
        >
          <span style={{ color: PRIMARY_COLOR }}>GENLIVE</span> MAKE YOUR "
          <span style={{ color: PRIMARY_COLOR }}>SPORTLIGHT</span>"
          <br />
        </h2>
      </div>

      {/* Vùng Carousel chính */}
      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 mt-0 sm:mt-10">
        {/* Creator Card Container */}
        <div
          key={currentIdol.id} // Key đổi để kích hoạt transitio500.0Knimation
          // Bỏ justify-center để nội dung ảnh/text dính sát hai bên
          className="flex flex-col lg:flex-row items-center lg:items-start bg-white transform animate-slideIn transition-all duration-700 shadow-none sm:shadow-lg lg:shadow-none "
        >
          {/* Idol Image (Left Side) - PHẦN CHÍNH: 40% WIDTH */}
          <div className="relative w-full lg:w-3/6 flex justify-center p-4">
            {/* Container chính cho hiệu ứng 3 ảnh và chấm hồng */}
            <div className="relative w-80 h-80 sm:w-120 sm:h-[500px] flex items-center justify-center">
              {/* Idol trước (Nền mờ bên trái) - Ẩn trên Mobile/Tablet để dễ Responsive */}
              <div
                className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-full opacity-50 z-10 transition-opacity duration-500"
                style={{
                  backgroundImage: `url(${prevIdol.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  // Tạo hiệu ứng cong nhẹ ở bên trái
                  borderRadius: "50% 0 50% 0 / 100% 0 100% 0",
                }}
              ></div>

              {/* Idol Chính (Hình chữ nhật trên, cung tròn dưới) - Z-index cao nhất */}
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <div
                  className="w-[100%] sm:w-[85%] h-[90%] transform transition duration-500 shadow-2xl overflow-hidden"
                  style={{
                    backgroundImage: `url(${currentIdol.imageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    // Shape: Hình chữ nhật trên, cung tròn dưới
                    borderRadius: "10px / 10px",
                    borderBottomLeftRadius: "50% 20%",
                    borderBottomRightRadius: "50% 20%",
                    border: `4px solid white`,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                  }}
                ></div>
              </div>

              {/* Idol sau (Nền mờ bên phải) - Ẩn trên Mobile/Tablet */}
              <div
                className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 w-full h-full opacity-50 z-10 transition-opacity duration-500"
                style={{
                  backgroundImage: `url(${nextIdol.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  // Tạo hiệu ứng cong nhẹ ở bên phải
                  borderRadius: "0 50% 0 50% / 0 100% 0 100%",
                }}
              ></div>

              {/* Pink Accent Circle 1 (Trên, trái - Nằm ngoài ảnh chính) */}
              <div
                className="absolute w-6 h-6 rounded-full top-1/4 -left-2 transform -translate-x-1/2 -translate-y-1/2 z-30 shadow-lg animate-pulse"
                style={{ backgroundColor: PRIMARY_COLOR }}
              ></div>

              {/* Pink Accent Circle 2 (Dưới, phải - Nằm ngoài ảnh chính) */}
              <div
                className="absolute w-10 h-10 rounded-full bottom-1/4 right-0 transform translate-x-1/2 translate-y-1/2 z-30 shadow-2xl animate-pulse delay-100"
                style={{ backgroundColor: PRIMARY_COLOR, opacity: 0.9 }}
              ></div>

              {/* Đường gạch dưới ảnh (Giống ảnh) */}
              <div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-1 rounded-sm"
                style={{ backgroundColor: PRIMARY_COLOR }}
              ></div>
            </div>
          </div>

          {/* Idol Details (Right Side) - PHẦN CHÍNH: 60% WIDTH */}
          <div className="w-full lg:w-3/6 p-4 pt-5 lg:pt-0 lg:pl-16 text-center lg:text-left">
  <h3
    className="text-4xl sm:text-4xl font-bold mb-3 tracking-tight"
    style={{ color: PRIMARY_COLOR }}
  >
    {currentIdol.name}
  </h3>

  <p
    className="text-lg font-semibold italic mb-4 opacity-80"
    style={{ color: PRIMARY_COLOR }}
  >
    {currentIdol.handle}
  </p>

  <div className="flex justify-center lg:justify-start space-x-12 mb-0 pb-4 border-b border-gray-200">
    <div>
      <p className="text-3xs font-bold uppercase text-gray-500">CORE TRAITS</p>
      <p
        className="text-lg font-semibold whitespace-pre-line"
        style={{ color: PRIMARY_COLOR }}
      >
        {currentIdol.followers}
      </p>
    </div>
    <div>
      <p className="text-3xs font-bold uppercase text-gray-500">SIGN</p>
      <p
        className="text-lg font-bold"
        style={{ color: TEXT_DARK_COLOR }}
      >
        {currentIdol.category}
      </p>
    </div>
  </div>

  <div className="pb-4 mb-0">
    <p className="text-gray-700 leading-relaxed text-base sm:text-lg text-start whitespace-pre-line">
      {currentIdol.description}
    </p>
    <div
      className="font-semibold cursor-pointer text-sm mt-5 inline-flex items-center space-x-1 hover:underline transition-colors"
      style={{ color: PRIMARY_COLOR }}
      onClick={() => {
        router.push(`/talents?category=${currentIdol.category}`);
      }}
    >
      <span>Explore {currentIdol.category} Talents</span>
      <span>→</span>
    </div>
  </div>
</div>

        </div>

        {/* Navigation Arrows - CHỈNH SỬA VỊ TRÍ BUTTONS */}

        {/* Button Prev: Luôn nằm bên trái khu vực ảnh */}
        <button
          onClick={goToPrev}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-30 p-2 text-gray-400 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        {/* Button Next: Nằm bên phải khu vực ảnh (tính từ khu vực 40%) */}
        <button
          onClick={goToNext}
          // Sử dụng Tailwind Grid hoặc Absolute để căn chỉnh chính xác:
          // Ẩn trên mobile. Trên lg+, căn theo 40% width.
          className="absolute right-0 lg:left-[50%] top-1/2 transform -translate-y-1/2 z-30 p-2 text-gray-400 hover:text-gray-700 transition-colors hidden lg:block"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
        {/* Button Next (Fallback Mobile) - Giữ ở cuối cùng để dễ click trên mobile */}
        <button
          onClick={goToNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-30 p-2 text-gray-400 hover:text-gray-700 transition-colors block lg:hidden"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>

        {/* Logo me nhỏ ở góc dưới phải (Giống ảnh) */}
      </div>
    </section>
  );
};

// Section 3: Services

const COMPANY_IMAGES = [
  {
    id: 1,
    // Sử dụng ảnh placeholder chất lượng cao từ Unsplash
    src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Đội ngũ của chúng tôi đang làm việc",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Một buổi họp sáng tạo",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Lập trình viên đang code",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1542744095-291d1f67b221?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Một buổi thuyết trình thành công",
  },
];

/**
 * Component giới thiệu công ty với lưới ảnh 2x2 có hiệu ứng.
 */


const AboutCompany: React.FC = () => {
  const [currentIndexTop, setCurrentIndexTop] = useState(0);
  const [currentIndexBottom, setCurrentIndexBottom] = useState(0);

  const topImages = COMPANY_IMAGES.slice(0, 2);
  const bottomImages = COMPANY_IMAGES.slice(2, 4);

  // Auto slide every 3s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndexTop((prev) => (prev + 1) % topImages.length);
      setCurrentIndexBottom((prev) => (prev + 1) % bottomImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [topImages.length, bottomImages.length]);

  return (
    <section className="py-0 sm:py-16 px-4 md:px-8 bg-white flex flex-col items-center">
      <p
        className="text-3xs sm:text-3xl font-bold tracking-widest mb-2 uppercase"
        style={{ color: PRIMARY_COLOR }}
      >
        ABOUT US
      </p>

      <h2
        className="text-3xl sm:text-5xl md:text-5xl text-center font-extrabold max-w-4xl mx-auto"
        style={{ color: TEXT_DARK_COLOR }}
      >
        PIONEERING CREATIVITY,{" "}
        <span style={{ color: PRIMARY_COLOR }}>SHAPING THE FUTURE</span>
      </h2>

      {/* --- MOBILE MODE: 2 hàng, mỗi hàng là carousel --- */}
      <div className="w-full max-w-6xl mx-auto mt-10 sm:hidden">
        {/* Hàng 1 */}
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl mb-4">
          {topImages.map((image, index) => (
            <img
              key={image.id}
              src={image.src}
              alt={image.alt}
              className={`absolute w-full h-full object-cover transition-opacity duration-700 rounded-xl ${
                index === currentIndexTop ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        {/* Hàng 2 */}
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-xl">
          {bottomImages.map((image, index) => (
            <img
              key={image.id}
              src={image.src}
              alt={image.alt}
              className={`absolute w-full h-full object-cover transition-opacity duration-700 rounded-xl ${
                index === currentIndexBottom ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>

      {/* --- DESKTOP MODE: 2x2 grid tĩnh --- */}
      <div className="hidden sm:grid grid-cols-2 gap-6 md:gap-8 mt-20 max-w-6xl">
        {COMPANY_IMAGES.map((image) => (
          <div
            key={image.id}
            className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer"
            style={
              { "--primary-color": PRIMARY_COLOR } as React.CSSProperties
            }
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover rounded-xl aspect-[16/10] transition-transform duration-500 ease-in-out group-hover:scale-110"
            />
            <div
              className="absolute inset-0 rounded-xl border-4 border-transparent transition-all duration-300 group-hover:border-[var(--primary-color)]"
            ></div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ServiceCard: React.FC<{
  service: (typeof TSP_SERVICES)[0];
}> = ({ service }) => {
  const isLink = false;

  // --- LOGIC STYLES CHO ICON CONTAINER (tất cả như nhau) ---
  const iconBgColor = "white";
  const iconBorderColor = PRIMARY_COLOR;
  const iconTextColor = PRIMARY_COLOR;
  const cardTextColor = TEXT_DARK_COLOR;

  return (
    <div
      className={`
        flex flex-col items-center p-2 rounded-xl text-center
        shadow-none transition-all duration-300 cursor-pointer w-full
        hover:scale-105
      `}
      style={{ backgroundColor: "white" }}
    >
      {/* ICON CONTAINER */}
      <div
        className={`
          w-20 h-20 sm:w-30 sm:h-30 mb-4 rounded-full flex items-center justify-center
          text-3xl transition-all duration-300 border
        `}
        style={{
          borderColor: iconBorderColor,
          backgroundColor: iconBgColor,
        }}
      >
        <span style={{ color: iconTextColor }}>{service.icon}</span>
      </div>

      {/* TEXT */}
      <p
        className={`font-bold text-sm sm:text-base mb-1 mt-3`}
        style={{ color: cardTextColor }}
      >
        {service.title}
      </p>
    </div>
  );
};

const ServicesSection: React.FC = ({}) => {
  // State để quản lý service đang được chọn (Active)
  const [activeService, setActiveService] = useState<string | null>(
    TSP_SERVICES[0].title,
  );

  const handleCardClick = useCallback((title: string) => {
    setActiveService(title);
  }, []);

  return (
    <section className="py-12 sm:py-16 px-4 md:px-8 bg-white flex flex-col items-center">
      {/* Tiêu đề chính */}
      <p
        className="text-3xs sm:text-3xl font-bold tracking-widest mb-2"
        style={{ color: PRIMARY_COLOR }}
      >
        OUR SERVICES
      </p>
      <h2
        className="text-3xl sm:text-5xl md:text-5xl text-center font-extrabold max-w-8xl mx-auto"
        style={{ color: TEXT_DARK_COLOR }}
      >
        TURN YOUR PASSION "{" "}
        <span style={{ color: PRIMARY_COLOR }}>INTO LIVE IMPACT</span>"
      </h2>

      <div className="w-full max-w-6xl mx-auto mt-10 sm:mt-25">

        {/* 10 items - 2 hàng - 5 cột mỗi hàng */}
        <div className="grid grid-cols-2  sm:grid-cols-4 gap-4 md:gap-8">
          {TSP_SERVICES.map((service, index) => (
            <ServiceCard
              key={"tsp-" + index}
              service={service}
              // isActive={activeService === service.title}
              // onClick={() => handleCardClick(service.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// Section 4: Brands
const BrandsSection: React.FC = () => (
  <section className="relative py-10 sm:py-20 px-4 md:px-8 bg-black flex flex-col items-center overflow-hidden">
    {/* Lớp phủ họa tiết chấm bi */}
    <div className="absolute inset-0 bg-[url')] opacity-20 z-0"></div>

    {/* Tiêu đề */}
    <div className="relative z-10 text-center mb-12">
      <p
        className="text:2xs sm:text-xl font-bold tracking-widest mb-2"
        style={{ color: PRIMARY_COLOR }}
      >
        OUR TALENTS
      </p>
      <h2 className="text-2xl md:text-4xl font-extrabold text-white max-w-4xl leading-tight">
        WE'RE PROUD TO EMPOWER{" "}
        <span style={{ color: PRIMARY_COLOR }}>GENLIVE TALENTS</span> WHO BRING
        CREATIVE ENERGY AND AUTHENTIC CONNECTIONS TO EVERY LIVESTREAM
      </h2>
    </div>

    {/* Brand Scroller Container */}
    <div className="relative w-full max-w-7xl mx-auto z-10">
      {/* Hàng trên - Cuộn sang trái */}
      <div className="relative flex overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
        <div className="flex animate-scroll-left">
          {[...TOP_BRANDS_DATA, ...TOP_BRANDS_DATA].map(
            (
              brand,
              index, // Nhân đôi để cuộn vô tận
            ) => (
              <div
                key={`top-${index}`}
                className="flex-none mx-4 w-40 h-20 flex items-center justify-center bg-gray-800 rounded-lg shadow-lg border border-gray-700"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-[80%] max-h-[80%] object-contain"
                />
              </div>
            ),
          )}
        </div>
      </div>

      {/* Hàng dưới - Cuộn sang phải */}
      <div className="relative flex overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)] mt-4">
        <div className="flex animate-scroll-right">
          {[...BOTTOM_BRANDS_DATA, ...BOTTOM_BRANDS_DATA].map(
            (
              brand,
              index, // Nhân đôi để cuộn vô tận
            ) => (
              <div
                key={`bottom-${index}`}
                className="flex-none mx-4 w-40 h-20 flex items-center justify-center bg-gray-800 rounded-lg shadow-lg border border-gray-700"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-[80%] max-h-[80%] object-contain"
                />
              </div>
            ),
          )}
        </div>
      </div>
    </div>
  </section>
);

// Section 5: Stats and Footer
// Cần đặt cùng chỗ với các hàm Utils khác
const parseValue = (value: string): { base: number; suffix: string } => {
  // Tách phần số (có thể bao gồm dấu phẩy) và phần hậu tố còn lại
  const match = value.match(/(\d[\d,.]*)/);
  let numStr = match ? match[0].replace(/,/g, "") : "0";

  // Attempt to parse the number
  const base = parseInt(numStr.replace(/[^\d]/g, ""), 10);

  // Phần còn lại là hậu tố
  const suffix = value.replace(numStr, "").trim();

  return { base, suffix };
};

// Component thực hiện hiệu ứng đếm số trong 4 giây, chạy lại mỗi lần hiển thị
const StatCounter: React.FC<{ value: string; label: string }> = ({
  value,
  label,
}) => {
  const { base, suffix } = parseValue(value);
  const startValue = Math.max(0, base - 50);

  // Đã đổi state thành currentCount và thêm isVisible
  const [currentCount, setCurrentCount] = useState(startValue);
  const [isVisible, setIsVisible] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  // Logic 1: Intersection Observer (Cập nhật isVisible khi vào/ra màn hình)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Đơn giản chỉ cập nhật state khi component xuất hiện hoặc bị ẩn
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      // Đảm bảo dừng observe khi component bị unmount
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Logic 2: Counter animation (Chạy lại mỗi khi isVisible thay đổi thành TRUE)
  useEffect(() => {
    // Nếu không hiển thị, reset số về startValue và thoát
    if (!isVisible) {
      setCurrentCount(startValue);
      return;
    }

    const duration = 1500; // 4 giây
    const startTime = Date.now();
    const step = 20;

    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const progress = Math.min(1, elapsedTime / duration);

      const countValue =
        startValue + Math.floor((base - startValue) * progress);

      setCurrentCount(countValue);

      if (progress >= 1) {
        clearInterval(interval);
        setCurrentCount(base);
      }
    }, step);

    // Cleanup: Dừng interval khi component bị ẩn
    return () => clearInterval(interval);
  }, [isVisible, base, startValue]); // Chạy lại mỗi khi isVisible thay đổi

  return (
    <div ref={ref} className="p-4">
      <p className="text-3xl sm:text-5xl font-black mb-1">
        {currentCount.toLocaleString("en-US")}
        {suffix}
      </p>
      <p className="text-xl font-bold ">{label}</p>
    </div>
  );
};
const StatsNumber: React.FC = () => (
  <section className="bg-pink-600 py-0 px-2 md:py-16 md:px-8">
    <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-8 text-white text-center">
      {STATS_DATA.map((stat, index) => (
        <StatCounter key={index} value={stat.value} label={stat.label} />
      ))}
    </div>
  </section>
);

/**
 * Trang chủ tổng hợp tất cả các sections
 */

interface HomePageContentProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}
const HomePageContent: React.FC<HomePageContentProps> = ({
  setCurrentPage,
}) => (
  <div className="max-w-full overflow-hidden">
    <FullScreenBanner />
    <CreatorsCarousel />
    <AboutCompany />
    <ServicesSection />
    <BrandsSection />
    <StatsNumber />
  </div>
);
export default HomePageContent;

// --- 3. MAIN APP COMPONENT ---

/**
 * Component Home chính, quản lý việc chuyển đổi giữa các "trang" (views)
 */
