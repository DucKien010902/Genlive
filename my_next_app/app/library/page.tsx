"use client";
import { useEffect, useState } from "react";
const PRIMARY_COLOR = "#b6202b";
const initialCreators = [
  {
    id: 1,
    name: "Huỳnh Bảo",
    handle: "@swatchesbybaobao",
    followers: "N/A",
    category: "Fashion",
    imageUrl:
      "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/1/7/992693/Copy_Of_Main.jpg",
    description:
      "Huỳnh Bảo là một stylist và fashionista nổi tiếng với phong cách độc đáo cùng khả năng phối đồ đầy sáng tạo. Anh thường xuyên xuất hiện tại các sự kiện thời trang lớn trong và ngoài nước, trở thành tâm điểm của ống kính truyền thông nhờ gu ăn mặc tinh tế và tinh thần dám thử nghiệm. Không chỉ là người yêu thời trang, Huỳnh Bảo còn là biểu tượng của sự tự tin, khẳng định cá tính riêng thông qua từng bộ outfit được anh biến hóa linh hoạt theo xu hướng hiện đại.Anh nổi tiếng với bộ sưu tập giày “khủng” gồm hàng trăm đôi đến từ các thương hiệu cao cấp và limited edition hiếm có, mỗi đôi đều gắn liền với một câu chuyện về hành trình, cảm xúc và phong cách cá nhân. Trên các nền tảng mạng xã hội, Huỳnh Bảo thường chia sẻ những video đánh giá sản phẩm chân thực, truyền cảm hứng mạnh mẽ cho cộng đồng yêu thời trang trẻ tuổi. Giọng nói tự tin, thái độ chuyên nghiệp cùng kiến thức sâu rộng về xu hướng giúp anh trở thành người dẫn dắt phong cách cho hàng trăm nghìn người theo dõi.Không dừng lại ở việc làm đẹp cho bản thân, Huỳnh Bảo còn thường xuyên hợp tác với nhiều thương hiệu nổi tiếng trong các chiến dịch thời trang, chụp ảnh quảng bá và tư vấn định hình phong cách cá nhân cho người nổi tiếng, KOLs, cũng như các thương hiệu khởi nghiệp trong lĩnh vực thời trang. Anh luôn tin rằng thời trang không chỉ là vẻ bề ngoài, mà còn là cách con người thể hiện cá tính và năng lượng sống.",
  },
  {
    id: 2,
    name: "Fabo Nguyễn",
    handle: "@fabonguyen",
    followers: "N/A",
    category: "Fashion",
    imageUrl:
      "https://monozy.net/wp-content/uploads/2022/07/chup-anh-idol-kpop-7-900x900.jpg",
    description:
      "Fabo Nguyễn là một YouTuber và reviewer thời trang, sneaker có sức ảnh hưởng lớn. Anh nổi tiếng với bộ sưu tập giày đồ sộ và những video đánh giá sản phẩm chân thực, thu hút hàng triệu lượt xem.",
  },
  {
    id: 3,
    name: "Bảo Hân Helia",
    handle: "@baohanheliia",
    followers: "N/A",
    category: "Fashion",
    imageUrl:
      "https://png.pngtree.com/thumb_back/fw800/background/20250701/pngtree-handsome-kpop-idol-in-blue-sweater-poses-confidently-with-elegant-smile-image_17585022.jpg",
    description:
      "Bảo Hân Helia là một người mẫu ảnh và KOL trong lĩnh vực thời trang. Với gương mặt ấn tượng và phong thái tự tin, cô thường xuyên hợp tác với các thương hiệu lớn và xuất hiện trên các tạp chí thời trang.",
  },
  {
    id: 4,
    name: "Nguyễn Quốc Bảo",
    handle: "@qbaorn64",
    followers: "N/A",
    category: "Fashion",
    imageUrl:
      "https://static2.yan.vn/YanNews/2167221/202009/dan-idol-mang-danh-em-gai-quoc-dan-ai-moi-la-chan-ai-trong-long-knet-5968e511.jpg",
    description:
      "Nguyễn Quốc Bảo là một nhà thiết kế trẻ tài năng, nổi tiếng với các bộ sưu tập mang đậm dấu ấn cá nhân và sự phá cách. Anh đã đạt được nhiều giải thưởng danh giá trong ngành thời trang Việt Nam.",
  },
  {
    id: 13,
    name: "Trần Khánh Linh",
    handle: "@khanhlinh.99",
    followers: "N/A",
    category: "Fashion",
    imageUrl: "https://cf.shopee.vn/file/c290d9c8e04291d2e7c0581dca620bfa",
    description:
      "Trần Khánh Linh là một fashionista được yêu thích với gu thời trang thanh lịch, hiện đại. Cô thường chia sẻ bí quyết làm đẹp và phối đồ trên các nền tảng mạng xã hội, truyền cảm hứng cho nhiều bạn trẻ.",
  },
  {
    id: 14,
    name: "Phạm Minh Quân",
    handle: "@quanpham_style",
    followers: "N/A",
    category: "Fashion",
    imageUrl:
      "https://bazaarvietnam.vn/wp-content/uploads/2024/03/top-cac-nghe-si-lam-mong-duoc-cac-nhom-nhac-nu-kpop-yeu-thich-2.jpg",
    description:
      "Phạm Minh Quân là một influencer trong lĩnh vực thời trang nam. Anh mang đến những gợi ý về phong cách lịch lãm, cá tính và cách chăm sóc bản thân, được nhiều nam giới theo dõi.",
  },
  {
    id: 15,
    name: "Ngô Thảo My",
    handle: "@thaomy._fit",
    followers: "N/A",
    category: "Fashion",
    imageUrl:
      "https://cdn.kienthuc.net.vn/images/cf739f51f3276a5be16e9cbb75eb67059e60388eb13f18adc32d349a20164a166296c21fa3d7cd187bc42bdf9ef785639ef29f8615a3c4a1f4a8c1506cc7888a6fc2561813d208ffb21095732a32b16e7f9db13a0bcc7d74fec62aa184a67b69fba30d9a7d3640fce933b196e90e56bc/my-tam-dep-het-cho-che-trong-loat-anh-moi-Hinh-3.jpg",
    description:
      "Ngô Thảo My là một người mẫu fitness và thời trang. Cô không chỉ sở hữu thân hình khỏe khoắn mà còn có phong cách ăn mặc năng động, truyền cảm hứng sống lành mạnh cho cộng đồng.",
  },
  {
    id: 5,
    name: "Linh An",
    handle: "@linhan1998",
    followers: "N/A",
    category: "Beauty",
    imageUrl:
      "https://dep.com.vn/wp-content/uploads/2023/12/dep-review-lam-dep-maquillage-linh-an-thumb.jpg",
    description:
      "Linh An là một beauty blogger chuyên chia sẻ các mẹo trang điểm, chăm sóc da và review sản phẩm làm đẹp. Cô được biết đến với những hướng dẫn chi tiết, dễ hiểu và các sản phẩm đề xuất chất lượng.",
  },
  {
    id: 6,
    name: "Trúc Đào",
    handle: "@truc.dao",
    followers: "N/A",
    category: "Beauty",
    imageUrl:
      "https://image.vtc.vn/files/news/2023/07/28/truc-dao-gay-an-tuong-voi-ve-dep-trong-treo-ngay-tho-0857317.jpg",
    description:
      "Trúc Đào là một influencer về làm đẹp tự nhiên. Cô tập trung vào việc chia sẻ các phương pháp làm đẹp từ thiên nhiên, lối sống xanh và các sản phẩm thân thiện với môi trường.",
  },
  {
    id: 7,
    name: "Jimmy Trịnh",
    handle: "@jimmytrih203",
    followers: "N/A",
    category: "Personal Care",
    imageUrl:
      "https://media-cdn-v2.laodong.vn/Storage/NewsPortal/2022/1/7/992693/Copy_Of_Main.jpg",
    description:
      "Jimmy Trịnh là một chuyên gia về chăm sóc cá nhân và rèn luyện sức khỏe. Anh thường xuyên chia sẻ các bài tập, chế độ dinh dưỡng và lời khuyên để có một cơ thể khỏe mạnh và tinh thần sảng khoái.",
  },
  {
    id: 8,
    name: "Diệp Bảo Ngọc",
    handle: "@diepbaongoc18",
    followers: "852.8K",
    category: "Personal Care",
    imageUrl:
      "https://vtv1.mediacdn.vn/thumb_w/650/2021/11/17/img-20211117215206-16371511266011158428801.jpg",
    description:
      "Diệp Bảo Ngọc là một nữ diễn viên đã tham gia nhiều bộ phim điện ảnh và truyền hình thành công. Là một người mẫu và diễn viên có xuất thân từ cuộc thi Miss Teen 2010, cô không chỉ sở hữu gương mặt xinh đẹp mà còn có khả năng diễn xuất linh hoạt, nhận được nhiều giải thưởng trong lĩnh vực điện ảnh.",
  },
  {
    id: 9,
    name: "Tiko Tiến Công",
    handle: "@tikotiengcong",
    followers: "N/A",
    category: "Food",
    imageUrl: "https://placehold.co/150x150/000000/FFFFFF?text=Tiko+Cong",
    description:
      "Tiko Tiến Công là một food reviewer hài hước và được yêu mến. Anh nổi tiếng với những video trải nghiệm ẩm thực đa dạng, từ món ăn đường phố đến nhà hàng sang trọng, với cách bình luận dí dỏm và chân thật.",
  },
  {
    id: 10,
    name: "Mạnh Cao",
    handle: "@manhcao",
    followers: "N/A",
    category: "Food",
    imageUrl: "https://placehold.co/150x150/000000/FFFFFF?text=Manh+Cao",
    description:
      "Mạnh Cao là một đầu bếp trẻ tài năng, chuyên về ẩm thực fusion. Anh thường xuyên chia sẻ các công thức nấu ăn sáng tạo và những mẹo vặt hữu ích trong bếp, giúp mọi người dễ dàng tự tay chế biến món ngon.",
  },
  {
    id: 11,
    name: "Tên Khác 1",
    handle: "@tenkhac01",
    followers: "N/A",
    category: "Other",
    imageUrl: "https://placehold.co/150x150/000000/FFFFFF?text=Other+1",
    description:
      "Tên Khác 1 là một nghệ sĩ đa tài, hoạt động trong nhiều lĩnh vực như ca hát, diễn xuất và sáng tác. Anh được biết đến với giọng hát truyền cảm và khả năng biến hóa trong các vai diễn.",
  },
  {
    id: 12,
    name: "Tên Khác 2",
    handle: "@tenkhac02",
    followers: "N/A",
    category: "Other",
    imageUrl: "https://placehold.co/150x150/000000/FFFFFF?text=Other+2",
    description:
      "Tên Khác 2 là một vlogger du lịch nổi tiếng, chuyên khám phá những địa điểm độc đáo và chia sẻ kinh nghiệm du lịch hữu ích. Cô truyền cảm hứng cho nhiều người yêu thích xê dịch.",
  },
  {
    id: 16,
    name: "Quoc Truong Actor",
    handle: "@quoctruong.official",
    followers: "2.1M",
    category: "ENTERTAINMENT",
    imageUrl:
      "https://media.vov.vn/sites/default/files/styles/large/public/2023-11/4_14.jpeg.jpg",
    description:
      "Quốc Trường là nam diễn viên nổi tiếng của Việt Nam, được biết đến qua các vai diễn điện ảnh và truyền hình. Anh cũng là một doanh nhân thành công và có ảnh hưởng lớn trên mạng xã hội.",
  },
  {
    id: 17,
    name: "Ngo Thanh Van",
    handle: "@ngothanhvan",
    followers: "1.5M",
    category: "FILM",
    imageUrl: "https://placehold.co/320x384/9370DB/white?text=NTV",
    description:
      "Ngô Thanh Vân (Veronica Ngo) là nữ diễn viên, người mẫu và nhà sản xuất có tầm ảnh hưởng của Việt Nam. Cô được biết đến qua nhiều vai diễn quốc tế và những đóng góp cho điện ảnh nước nhà.",
  },
];

const categories = [
  { key: "Fashion", label: "Fashion" },
  { key: "Beauty", label: "Beauty" },
  { key: "Personal Care", label: "Personal Care" },
  { key: "Food", label: "Food" },
  { key: "Other", label: "Other" },
];

interface Creator {
  id: number;
  name: string;
  handle: string;
  category: string;
  imageUrl: string;
  description: string;
}

// Thẻ card
const CreatorCard: React.FC<{
  creator: Creator;
  onCardClick: (creator: Creator) => void;
}> = ({ creator, onCardClick }) => {
  return (
    <div
      className="flex flex-col items-start text-start group cursor-pointer"
      onClick={() => onCardClick(creator)}
    >
      <div className="relative w-full aspect-square rounded-2xl mb-3 shadow-md">
        <img
          src={creator.imageUrl}
          alt={creator.name}
          className="w-full h-full object-cover rounded-2xl relative z-10"
        />
        <div className="absolute inset-0 -m-[3px] rounded-2xl border-4 border-transparent group-hover:border-pink-500 transition-all duration-300 z-20 pointer-events-none"></div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-0.5">{creator.name}</h3>
      <p className="text-sm font-medium" style={{ color: PRIMARY_COLOR }}>
        {creator.handle}
      </p>
    </div>
  );
};

// Modal chi tiết có nút next/prev
interface CreatorDetailModalProps {
  creator: Creator;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const CreatorDetailModal: React.FC<{
  creator: Creator;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  prevName?: string;
  nextName?: string;
}> = ({ creator, onClose, onNext, onPrev, prevName, nextName }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-brightness-60 p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-[40px] shadow-xl w-full max-w-5xl min-h-[80vh] flex flex-col md:flex-row border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-5 right-6 text-gray-500 hover:text-gray-800 text-4xl font-light cursor-pointer"
        >
          &times;
        </button>

        {/* Cột trái - Ảnh + Prev / Next */}
        <div className="flex flex-col items-center justify-between p-8 w-full md:w-1/2 border-r border-gray-200">
          {/* Ảnh */}
          <div className="w-72 h-72 md:w-full md:h-full rounded-3xl overflow-hidden shadow-lg border-4 border-pink-400">
            <img
              src={creator.imageUrl}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between w-full mt-8">
            {/* PREV */}
            <div className="flex flex-col items-start text-pink-600 font-semibold text-lg">
              <span
                className="text-sm font-bold text-gray-500 hover:underline cursor-pointer"
                onClick={onPrev}
              >
                PREV
              </span>
              <span className="mt-1 text-xl">{prevName}</span>
            </div>

            {/* NEXT */}
            <div className="flex flex-col items-end text-pink-600 font-semibold text-lg">
              <span
                className="text-sm font-bold text-gray-500 hover:underline cursor-pointer"
                onClick={onNext}
              >
                NEXT
              </span>
              <span className="mt-1 text-xl">{nextName}</span>
            </div>
          </div>
        </div>

        {/* Cột phải - Nội dung, chỉ phần mô tả cuộn */}
        <div className="p-10 w-full md:w-1/2 flex flex-col text-center md:text-left">
          {/* Tiêu đề & Handle (Cố định) */}
          <div className="flex-shrink-0">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
              {creator.name}
            </h2>
            <p className="text-xl font-semibold mb-6 text-pink-600">
              {creator.handle}
            </p>
          </div>

          {/* Vùng mô tả có thể cuộn */}
          <div className="flex-grow overflow-y-auto pr-2 max-h-[59vh]">
            <p className="text-lg text-gray-500 leading-relaxed whitespace-pre-line">
              {creator.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component chính
type Page = "home" | "blog" | "library" | "contact";
interface LibraryPageProps {
  setCurrentPage: React.Dispatch<React.SetStateAction<Page>>;
}

export default function Library({ setCurrentPage }: LibraryPageProps) {
  const [activeCategory, setActiveCategory] = useState("Fashion");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filteredCreators = initialCreators.filter(
    (c) => c.category === activeCategory,
  );

  const handleCardClick = (creator: Creator) => {
    const index = filteredCreators.findIndex((c) => c.id === creator.id);
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
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề */}
        <h1 className="text-5xl font-extrabold text-center mb-8 tracking-widest text-gray-900 mt-25">
          CATEGORIES
        </h1>

        {/* Tabs */}
        <div className="flex justify-center space-x-3 sm:space-x-4 mb-12 mt-10">
          {categories.map((category) => {
            const isActive = category.key === activeCategory;
            return (
              <button
                key={category.key}
                onClick={() => {
                  setActiveCategory(category.key);
                  setSelectedIndex(null);
                }}
                className={`py-2 px-10 text-xl rounded-full font-bold transition-colors duration-300
                  ${
                    isActive
                      ? "bg-[#dc1a5d] text-white shadow-lg"
                      : "bg-white text-gray-700 border border-gray-300 hover:border-gray-500"
                  }`}
                style={{
                  boxShadow: isActive ? `0 4px 10px ${PRIMARY_COLOR}` : "none",
                }}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        {/* Danh sách */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10">
          {filteredCreators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onCardClick={handleCardClick}
            />
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            Chưa có Creators nào trong danh mục này.
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
