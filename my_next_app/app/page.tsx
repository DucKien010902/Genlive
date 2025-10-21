"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BsBoxArrowInRight, BsGraphUpArrow } from "react-icons/bs";
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
    name: "Fashion Icons",
    handle: "@fashionicons.vn",
    followers: "2.5M",
    category: "Fashion",
    imageUrl:
      "https://kenh14cdn.com/203336854389633024/2022/12/25/photo-4-1671939235993327077461.jpeg",
    description:
      "Nhóm các fashionista và stylist hàng đầu Việt Nam – những người dẫn đầu xu hướng, kết hợp gu thẩm mỹ độc đáo với sáng tạo cá nhân. Từ streetwear năng động đến high fashion, họ định hình phong cách cho thế hệ trẻ.",
  },
  {
    id: 2,
    name: "Beauty Gurus",
    handle: "@beautygurus.vn",
    followers: "1.9M",
    category: "Beauty",
    imageUrl:
      "https://static.elle.vn/img/LhW80MuiR5QqtCOZ_P1kyPD2Ouvan50bKqmO9mEOEM8/rs:fill:300:300/quality:90/plain/http://www.elle.vn/app/uploads/2025/10/06/702664/nhan-sac-sao-hoa-ngu-thumb.jpg@webp",
    description:
      "Cộng đồng beauty blogger và chuyên gia trang điểm nổi bật, chia sẻ xu hướng makeup, skincare và bí quyết chăm sóc bản thân. Nhóm đại diện cho vẻ đẹp hiện đại – tự tin, tự nhiên và tinh tế.",
  },
  {
    id: 3,
    name: "Food Lovers",
    handle: "@foodlovers.vn",
    followers: "3.2M",
    category: "Food",
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXFhampXx3BgA4_-47IC6FtdpP6WUgkKlEZQ&s",
    description:
      "Tập hợp những người đam mê ẩm thực Việt – từ các reviewer hài hước đến đầu bếp sáng tạo. Nhóm mang đến hành trình khám phá hương vị khắp ba miền, lan tỏa niềm vui ẩm thực đến cộng đồng mạng.",
  },
  {
    id: 4,
    name: "Entertainment Stars",
    handle: "@showbizvn",
    followers: "4.8M",
    category: "Entertainment",
    imageUrl:
      "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/12/10/1126086/Stray-Kids.jpeg",
    description:
      "Nhóm quy tụ các nghệ sĩ, diễn viên, ca sĩ có tầm ảnh hưởng trong làng giải trí Việt Nam. Họ không chỉ tỏa sáng trên sân khấu mà còn truyền cảm hứng về sự nỗ lực, sáng tạo và tinh thần cống hiến.",
  },
  {
    id: 5,
    name: "Lifestyle Influencers",
    handle: "@lifestyle.vn",
    followers: "2.3M",
    category: "Lifestyle",
    imageUrl:
      "https://static.elle.vn/img/TT73SLHt2h4HqzYBk1CROx7-NSkrDvR1qxHUDiDtSek/rs:fill:300:300/quality:90/plain/http://www.elle.vn/app/uploads/2024/03/19/576945/ELLE-Beauty-Award-2024-beauty-blogger-800x450-1.jpg@webp",
    description:
      "Nhóm influencer chia sẻ phong cách sống tích cực – từ du lịch, thể thao, sức khỏe đến phát triển bản thân. Họ khuyến khích cộng đồng sống cân bằng, sáng tạo và hướng tới giá trị bền vững.",
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
  {
    title: "Community Growth Hub",
    description: "Fan Retention",
    icon: <CiStar style={{ fontSize: 60 }} />,
  },
  {
    title: "See more >>",
    description: "",
    icon: <BsBoxArrowInRight style={{ fontSize: 50 }} />,
    isLink: true,
    targetPage: "brands",
  },
];


const TOP_BRANDS_DATA = [
  {
    name: "Kiehl's",
    logo: "https://placehold.co/100x40/000/white?text=KIEHL'S",
  },
  {
    name: "Shu Uemura",
    logo: "https://placehold.co/100x40/000/white?text=SHU",
  },
  {
    name: "TRESemmé",
    logo: "https://placehold.co/100x40/000/white?text=TRESEMME",
  },
  { name: "Furla", logo: "https://placehold.co/100x40/000/white?text=FURLA" },
  { name: "Klairs", logo: "https://placehold.co/100x40/000/white?text=KLAIRS" },
  {
    name: "Laneige",
    logo: "https://placehold.co/100x40/000/white?text=LANEIGE",
  },
  {
    name: "Innisfree",
    logo: "https://placehold.co/100x40/000/white?text=INNISFREE",
  },
  {
    name: "TRESemmé",
    logo: "https://placehold.co/100x40/000/white?text=TRESEMME",
  }, // Lặp lại để kéo dài
  { name: "Furla", logo: "https://placehold.co/100x40/000/white?text=FURLA" },
  { name: "Klairs", logo: "https://placehold.co/100x40/000/white?text=KLAIRS" },
];

const BOTTOM_BRANDS_DATA = [
  {
    name: "The COOCON",
    logo: "https://placehold.co/100x40/000/white?text=COOCON",
  },
  {
    name: "TSUBAKI",
    logo: "https://placehold.co/100x40/000/white?text=TSUBAKI",
  },
  {
    name: "Unilever",
    logo: "https://placehold.co/100x40/000/white?text=UNILEVER",
  },
  { name: "Bad B.", logo: "https://placehold.co/100x40/000/white?text=BADB" },
  {
    name: "LEVENTS",
    logo: "https://placehold.co/100x40/000/white?text=LEVENTS",
  },
  {
    name: "Maybelline",
    logo: "https://placehold.co/100x40/000/white?text=MAYBELLINE",
  },
  {
    name: "L'Oreal",
    logo: "https://placehold.co/100x40/000/white?text=LOREAL",
  },
  {
    name: "The COOCON",
    logo: "https://placehold.co/100x40/000/white?text=COOCON",
  }, // Lặp lại để kéo dài
  {
    name: "TSUBAKI",
    logo: "https://placehold.co/100x40/000/white?text=TSUBAKI",
  },
  {
    name: "Unilever",
    logo: "https://placehold.co/100x40/000/white?text=UNILEVER",
  },
];

const STATS_DATA = [
  { value: "100+", label: "Active Talents" },
  { value: "2000+", label: "Livestream Hours" },
  { value: "100+", label: "Livestream/ Month on social platforms" },
  { value: "100K+", label: "Views/ Month" },
  { value: "50K+", label: "Engagement/Month" },
];

const PRIMARY_COLOR = "#b6202b";
const TEXT_DARK_COLOR = "#000000ff";

// --- 1. COMMON COMPONENTS: NAVBAR & UNDER DEVELOPMENT PAGE ---

type Page = "home" | "blog" | "library" | "contact";

interface NavItemProps {
  name: string;
  targetPage: Page;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isScrolled: boolean; // THÊM PROP MỚI
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  targetPage,
  currentPage,
  setCurrentPage,
  isScrolled,
}) => {
  const isCurrent = currentPage === targetPage;

  // ĐỊNH NGHĨA MÀU SẮC DỰA TRÊN TRẠNG THÁI CUỘN
  const baseColor = isScrolled
    ? "text-gray-700 dark:text-gray-300"
    : "text-white";
  const hoverColor = isScrolled
    ? "hover:text-pink-600 dark:hover:text-pink-400"
    : "hover:text-pink-300";
  const activeColor = isScrolled
    ? "text-pink-600 border-b-2 border-pink-600"
    : "text-pink-400 border-b-2 border-pink-400";

  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setCurrentPage(targetPage);
      }}
      className={`
                px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                ${isCurrent && currentPage !== "home" ? activeColor : `${baseColor} ${hoverColor}`}
                ${currentPage === "home" && targetPage === "home" && activeColor}
            `}
    >
      {name}
    </a>
  );
};

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  isScrolled: boolean; // THÊM PROP MỚI
}

const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  isScrolled,
}) => (
  <nav
    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled ? "bg-white shadow-md" : "bg-transparent shadow-none"}`}
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* container flex */}
      <div className="flex items-center justify-between h-20">
        {/* Logo bên trái */}
        <div className="flex-shrink-0 flex items-center">
          <a
            href="#"
            onClick={() => setCurrentPage("home")}
            className="cursor-pointer flex items-center h-full"
          >
            <img
              src="/images/Logo Genlive.png"
              alt="Me Live Logo"
              className={`h-10 mt-2 w-auto transition-opacity duration-300 ${
                isScrolled ? "opacity-100" : "opacity-80"
              }`}
            />
          </a>
        </div>
        {/* NAV MENU GIỮA */}
        <div className="flex-1 flex justify-center">
          <div className="flex space-x-12">
            {" "}
            {/* tăng/giảm space-x nếu muốn */}
            <NavItem
              name="Home"
              targetPage="home"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              isScrolled={isScrolled}
            />
            <NavItem
              name="Library"
              targetPage="library"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              isScrolled={isScrolled}
            />
            <NavItem
              name="Blogs"
              targetPage="blog"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              isScrolled={isScrolled}
            />
            <NavItem
              name="Apply"
              targetPage="contact"
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              isScrolled={isScrolled}
            />
          </div>
        </div>
        {/* BÊN PHẢI: để trống hoặc thêm nút login */}
        <div className="w-20" /> {/* giữ cân đối hai bên */}
      </div>
    </div>
  </nav>
);

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
      className="absolute inset-0 flex items-center justify-center pt-16"
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
        <source src="/videos/background-video.mp4" type="video/mp4" />
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

  return (
    <section className="relative py-10 sm:py-16 px-4 md:px-8 bg-white flex flex-col items-center">
      {/* Tiêu đề - CHỈNH SỬA KÍCH THƯỚC VÀ ĐỘ RỘNG */}
      <div className="text-center mb-10 sm:mb-12 w-full max-w-6xl">
        <p
          className="font-bold tracking-widest mb-2"
          style={{ color: PRIMARY_COLOR, fontSize: 24 }}
        >
          OUR IDOL
        </p>
        <h2
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold max-w-8xl mx-auto"
          style={{ color: TEXT_DARK_COLOR }}
        >
          CELEBRATING OUR "
          <span style={{ color: PRIMARY_COLOR }}>LIVE WITH HEART</span>"
          <br />
          LIVESTREAM IDOL PARTNERS
        </h2>
      </div>

      {/* Vùng Carousel chính */}
      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 mt-10">
        {/* Creator Card Container */}
        <div
          key={currentIdol.id} // Key đổi để kích hoạt transitio500.0Knimation
          // Bỏ justify-center để nội dung ảnh/text dính sát hai bên
          className="flex flex-col lg:flex-row items-center lg:items-start bg-white transform animate-slideIn transition-all duration-700 shadow-lg lg:shadow-none"
        >
          {/* Idol Image (Left Side) - PHẦN CHÍNH: 40% WIDTH */}
          <div className="relative w-full lg:w-3/6 flex justify-center p-4">
            {/* Container chính cho hiệu ứng 3 ảnh và chấm hồng */}
            <div className="relative w-72 h-80 sm:w-120 sm:h-[500px] flex items-center justify-center">
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
                  className="w-[85%] h-[90%] transform transition duration-500 shadow-2xl overflow-hidden"
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
          <div className="w-full lg:w-3/6 p-4 pt-10 lg:pt-0 lg:pl-16 text-center lg:text-left">
            <h3
              className="text-5xl font-bold mb-2"
              style={{ color: PRIMARY_COLOR }}
            >
              {currentIdol.name}
            </h3>
            <p
              className="text-lg font-medium mb-6"
              style={{ color: PRIMARY_COLOR }}
            >
              {currentIdol.handle}
            </p>

            <div className="flex justify-center lg:justify-start space-x-12 mb-6 border-b border-gray-200 pb-4">
              <div>
                <p className="text-3xs font-bold  uppercase text-gray-500">
                  FOLLOWERS
                </p>
                <p
                  className="text-xl font-black"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {currentIdol.followers}
                </p>
              </div>
              <div>
                <p className="text-3xs font-bold uppercase text-gray-500">
                  CATEGORIES
                </p>
                <p
                  className="text-xl font-black"
                  style={{ color: TEXT_DARK_COLOR }}
                >
                  {currentIdol.category}
                </p>
              </div>
            </div>

            <div className="pb-4 mb-6">
              <p className="text-gray-600  leading-relaxed text-xl">
                {currentIdol.description}
              </p>
              <a
                href="#"
                className="font-semibold text-2xs mt-3 inline-block hover:underline transition-colors"
                style={{ color: PRIMARY_COLOR }}
              >
                READ MORE
              </a>
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
const ServiceCard: React.FC<{
  service: (typeof TSP_SERVICES)[0];
  isActive: boolean;
  onClick: () => void;
}> = ({ service, isActive, onClick }) => {
  const isLink = service.isLink;

  const handleClick = () => {
    if (isLink && service.targetPage) {
      // Yêu cầu 2: Chuyển trang khi bấm nút Link
      // setCurrentPage(service.targetPage);
    } else {
      onClick(); // Chuyển đổi trạng thái active
    }
  };

  // --- LOGIC STYLES CHO ICON CONTAINER ---

  let iconBgColor = "white";
  let iconBorderColor = PRIMARY_COLOR;
  let iconTextColor = PRIMARY_COLOR;

  if (isLink) {
    // Link Card: Nền đen, border đen, icon trắng
    iconBgColor = "black";
    iconBorderColor = "black";
    iconTextColor = "white";
  } else if (isActive) {
    // Active State: Nền hồng (PRIMARY_COLOR), border trắng, icon trắng
    iconBgColor = PRIMARY_COLOR;
    iconBorderColor = "white";
    iconTextColor = "white";
  }

  // Card Text Color (Luôn là màu đậm TEXT_DARK_COLOR vì nền card là trắng)
  const cardTextColor = isLink ? "black" : TEXT_DARK_COLOR;

  return (
    <div
      onClick={handleClick}
      className={`
                flex flex-col items-center p-2 rounded-xl text-center
                shadow-none transition-all duration-300 cursor-pointer w-full
                ${!isLink ? "hover:scale-105" : "transform"}
            `}
      // Đảm bảo card background luôn là màu trắng (hoặc BACKGROUND_LIGHT)
      style={{ backgroundColor: "white" }}
    >
      {/* ICON CONTAINER: Chỉ container này thay đổi màu */}
      <div
        className={`
                    w-20 h-20 sm:w-30 sm:h-30 mb-4 rounded-full flex items-center justify-center text-3xl transition-all duration-300 border
                `}
        style={{
          // Dynamic styling cho Border và Background của hình tròn
          borderColor: iconBorderColor,
          backgroundColor: iconBgColor,
        }}
      >
        <span style={{ color: iconTextColor }}>{service.icon}</span>
      </div>

      {/* Text Content */}
      <p
        className={`font-bold text-sm sm:text-base mb-1 ${!isLink ? "mt-3" : ""}`}
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
    <section className="py-20 px-4 md:px-8 bg-white flex flex-col items-center">
  {/* Tiêu đề chính */}
  <p
    className="text-xs font-bold tracking-widest mb-2"
    style={{ color: PRIMARY_COLOR, fontSize: 24 }}
  >
    OUR SERVICES
  </p>
  <h2
    className="text-4xl sm:text-5xl md:text-5xl font-extrabold max-w-8xl mx-auto"
    style={{ color: TEXT_DARK_COLOR }}
  >
    UNLOCK THE POWER OF{" "}
    <span style={{ color: PRIMARY_COLOR }}>YOUR PASSION</span>
  </h2>

  <div className="w-full max-w-6xl mx-auto mt-25">
    <h3
      className="text-4xl font-extrabold mb-8"
      style={{ color: TEXT_DARK_COLOR }}
    >
      Production Services
    </h3>

    {/* 10 items - 2 hàng - 5 cột mỗi hàng */}
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
      {TSP_SERVICES.map((service, index) => (
        <ServiceCard
          key={"tsp-" + index}
          service={service}
          isActive={activeService === service.title}
          onClick={() => handleCardClick(service.title)}
        />
      ))}
    </div>
  </div>
</section>

  );
};

// Section 4: Brands
const BrandsSection: React.FC = () => (
  <section className="relative py-20 px-4 md:px-8 bg-black flex flex-col items-center overflow-hidden">
    {/* Lớp phủ họa tiết chấm bi */}
    <div className="absolute inset-0 bg-[url('/images/dots-texture.png')] opacity-20 z-0"></div>

    {/* Tiêu đề */}
    <div className="relative z-10 text-center mb-12">
      <p
        className="text-xl font-bold tracking-widest mb-2"
        style={{ color: PRIMARY_COLOR }}
      >
        OUR CLIENTS
      </p>
      <h2 className="text-3xl md:text-4xl font-extrabold text-white max-w-4xl leading-tight">
        WE'RE PROUD TO BE A LONG-TERM PARTNER OF{" "}
        <span style={{ color: PRIMARY_COLOR }}>VIETNAM'S LEADING BRANDS</span>{" "}
        IN MULTIPLE CATEGORIES
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

    {/* Nút "Be our partner" */}
    <button className="relative z-10 mt-16 px-8 py-3 bg-pink-600 text-white font-semibold rounded-full shadow-lg hover:bg-pink-700 transition-colors duration-300">
      BE OUR PARTNER
    </button>
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
  const startValue = Math.max(0, base - 100);

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

    const duration = 2500; // 4 giây
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
      <p className="text-5xl font-black mb-1">
        {currentCount.toLocaleString("en-US")}
        {suffix}
      </p>
      <p className="text-xl font-bold ">{label}</p>
    </div>
  );
};
const StatsNumber: React.FC = () => (
  <section className="bg-pink-600 py-16 px-4 md:px-8">
    <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 text-white text-center">
      {/* Thay thế mapping tĩnh bằng StatCounter */}
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
  <div className="w-full">
    <FullScreenBanner />
    <CreatorsCarousel />
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
