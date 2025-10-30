// ⚠️ Không có "use client" => chạy ở server (SSR)
import { Clock, Eye, Folder, Tag } from "lucide-react";

// --- Mock Data (ĐÃ CẬP NHẬT) ---
// Dữ liệu content giờ là một mảng các đối tượng, không còn là HTML string
const mockArticleData = {
  id: "clx4yzt2q0000l8bif4t3a9z9",
  slug: "genlive-first-livestream",
  title:
    "Livestream đầu tiên của GenLive – Bước khởi đầu cho kỷ nguyên sáng tạo nội dung tương tác",
  excerpt:
    "Sự kiện livestream ra mắt của GenLive đã chính thức diễn ra, đánh dấu một cột mốc quan trọng trong lĩnh vực giải trí tương tác và mở ra những hứa hẹn mới cho người sáng tạo và khán giả.",
  coverImage:
    "https://placehold.co/1200x600/1a1a2e/ffffff?text=GenLive+Launch&font=inter",
  authorName: "GenLive Team",
  authorAvatar: "https://placehold.co/100x100/4a4a8e/ffffff?text=G&font=inter",
  publishedAt: "2025-10-24T10:00:00.000Z",
  category: "Sự kiện",
  tags: ["GenLive", "Livestream", "Tương tác", "Sáng tạo nội dung", "VTuber"],
  views: 12800,

  // ==========================================================
  // NỘI DUNG ĐÃ ĐƯỢC CẤU TRÚC LẠI (THAY THẾ CHUỖI HTML)
  // ==========================================================
  content: [
    {
      type: "paragraph",
      style: "lead", // Key tùy chỉnh để xác định style "lead"
      text: "Tối qua, buổi livestream chính thức đầu tiên của GenLive đã diễn ra thành công rực rỡ, thu hút hàng chục ngàn lượt xem đồng thời. Đây không chỉ là một buổi ra mắt, mà còn là tuyên bố về một kỷ nguyên mới của nội dung tương tác.",
    },
    {
      type: "heading",
      level: 2,
      text: "Điều gì làm nên sự khác biệt?",
    },
    {
      type: "paragraph",
      text: "Không giống như các nền tảng livestream truyền thống, GenLive tập trung vào khả năng tương tác sâu giữa người sáng tạo (Idols/VTubers) và khán giả. Sử dụng công nghệ AI và real-time rendering, GenLive cho phép khán giả ảnh hưởng trực tiếp đến nội dung của buổi live.",
    },
    {
      type: "list",
      // Chúng ta vẫn dùng HTML cho các phần text nhỏ (như <strong>)
      // để giữ sự linh hoạt, nhưng không render cả khối HTML.
      items: [
        "<strong>Tương tác thời gian thực:</strong> Khán giả có thể bỏ phiếu cho hành động tiếp theo, thay đổi trang phục, hoặc thậm chí là bối cảnh của buổi live.",
        "<strong>Hệ thống quà tặng sáng tạo:</strong> Thay vì các sticker đơn thuần, quà tặng có thể kích hoạt các hiệu ứng đặc biệt hoặc mini-game ngay trên sóng.",
        "<strong>Chất lượng hình ảnh vượt trội:</strong> Với mô hình 3D và công nghệ motion capture tiên tiến, các Idol của GenLive xuất hiện với độ chi tiết và mượt mà đáng kinh ngạc.",
      ],
    },
    {
      type: "heading",
      level: 2,
      text: "Phản ứng từ cộng đồng",
    },
    {
      type: "paragraph",
      text: "Cộng đồng mạng đã bùng nổ với những phản hồi tích cực. Nhiều người xem bày tỏ sự thích thú trước mức độ \"nhập vai\" và \"kiểm soát\" mà họ có được. Hashtag #GenLiveLaunch nhanh chóng leo lên top thịnh hành trên các mạng xã hội.",
    },
    {
      type: "quote",
      text: "\"Đây là lần đầu tiên tôi cảm thấy mình thực sự là một phần của buổi livestream chứ không chỉ là người xem. Thật không thể tin được!\" - một người dùng bình luận.",
    },
    {
      type: "heading",
      level: 2,
      text: "Bước tiếp theo cho GenLive",
    },
    {
      type: "paragraph",
      text: "Đội ngũ GenLive chia sẻ rằng đây mới chỉ là bước khởi đầu. Họ dự định sẽ mở rộng danh sách các Idol, phát triển thêm nhiều tính năng tương tác độc quyền và tổ chức các sự kiện hợp tác quy mô lớn trong thời gian tới. Kỷ nguyên sáng tạo nội dung tương tác đã chính thức bắt đầu.",
    },
  ],
};
// --- Hết Mock Data ---

/**
 * Hàm giả lập việc gọi API (Giữ nguyên)
 */
async function getArticle(slug: string) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  if (slug === mockArticleData.slug) {
    return mockArticleData;
  } else {
    throw new Error("Không tìm thấy bài viết");
  }
}

// Helper để định dạng ngày (Giữ nguyên)
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ==========================================================
// COMPONENT MỚI ĐỂ RENDER NỘI DUNG
// ==========================================================
// Component này sẽ duyệt qua mảng `content` và render các thẻ HTML
// với đúng class CSS từ bản gốc.
function RenderContent({ content }: { content: any[] }) {
  return (
    <>
      {content.map((block, index) => {
        const key = `content-${index}`;

        switch (block.type) {
          // Render thẻ <p>
          case "paragraph":
            if (block.style === "lead") {
              // Đây là đoạn "lead" đặc biệt
              return (
                <p
                  key={key}
                  className="lead text-lg md:text-xl text-gray-700 dark:text-gray-400 mb-6"
                >
                  {block.text}
                </p>
              );
            }
            // Đây là đoạn <p> thông thường
            return (
              <p key={key} className="mb-4">
                {block.text}
              </p>
            );

          // Render thẻ <h2>
          case "heading":
            if (block.level === 2) {
              return (
                <h2
                  key={key}
                  className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4"
                >
                  {block.text}
                </h2>
              );
            }
            // (Bạn có thể thêm case cho h3, h4... nếu cần)
            break;

          // Render thẻ <ul>
          case "list":
            return (
              <ul
                key={key}
                className="list-disc list-inside space-y-2 mb-6 pl-4"
              >
                {block.items.map((item: string, itemIndex: number) => (
                  // Vẫn dùng dangerouslySetInnerHTML ở mức độ nhỏ (chỉ cho <li>)
                  // để xử lý các tag <strong>
                  <li
                    key={itemIndex}
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                ))}
              </ul>
            );

          // Render thẻ <blockquote>
          case "quote":
            return (
              <blockquote
                key={key}
                className="border-l-4 border-purple-500 pl-4 py-2 my-6 italic text-gray-700 dark:text-gray-400"
              >
                {block.text}
              </blockquote>
            );

          default:
            return null;
        }
      })}
    </>
  );
}

// Component chính của trang (ĐÃ CẬP NHẬT)
export default async function ArticleDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // const article = await getArticle(params.slug);
  const article = mockArticleData; // Dùng mock data đã cập nhật

  return (
    <div className="bg-white text-gray-900 ">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 mt-10">
        {/* --- Phần Header Bài Viết (Giữ nguyên) --- */}
        <header className="mb-8">
          {/* Category */}
          <div className="flex items-center text-purple-600 dark:text-purple-400 mb-2">
            <Folder size={16} className="mr-2" />
            <span className="font-semibold text-sm uppercase">
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Excerpt/Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-6">
            {article.excerpt}
          </p>

          {/* --- Thông tin tác giả và ngày đăng (Giữ nguyên) --- */}
          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            {/* Tác giả */}
            <div className="flex items-center">
              <img
                src={article.authorAvatar}
                alt={article.authorName}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <span className="font-medium text-gray-400 ">
                {article.authorName}
              </span>
            </div>

            <span className="hidden md:block">|</span>

            {/* Ngày đăng */}
            <div className="flex items-center">
              <Clock size={14} className="mr-1.5" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>

            <span className="hidden md:block">|</span>

            {/* Lượt xem */}
            <div className="flex items-center">
              <Eye size={14} className="mr-1.5" />
              <span>{article.views.toLocaleString("vi-VN")} lượt xem</span>
            </div>
          </div>
        </header>

        {/* --- Ảnh Bìa (Giữ nguyên) --- */}
        <figure className="mb-8">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-auto rounded-lg object-cover shadow-lg"
            style={{ aspectRatio: "16/9" }}
          />
        </figure>

        {/* --- Nội Dung Bài Viết (ĐÃ CẬP NHẬT) --- */}
        <article
          className="max-w-none" // Bỏ các class 'prose' vì chúng ta đã tự định dạng
        >
          {/* Gọi component RenderContent mới */}
          <RenderContent content={article.content} />
        </article>

        {/* --- Phần Tags (Giữ nguyên) --- */}
        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-wrap gap-2">
            <Tag size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800
                           text-gray-700 dark:text-gray-300
                           rounded-full text-sm font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </footer>
      </div>
    </div>
  );
}
