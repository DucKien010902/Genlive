"use client";

import React, { useState } from "react";
import { FaDotCircle, FaFacebookF, FaPhone, FaTiktok } from "react-icons/fa";
const FINAL_FOOTER_DATA = {
  Headquarter:
    "GenLive Studio, Tòa CT3, khu đô thị Nghĩa Đô, ngõ 106 Hoàng Quốc Việt, Cầu Giấy, Hà Nội.",
  GoogleMapLink:
    "https://www.google.com/maps/place/Chung+c%C6%B0+CT3+Ngh%C4%A9a+%C4%90%C3%B4/@21.0497034,105.7905953,17z/data=!3m1!4b1!4m6!3m5!1s0x3135ab7ab07df9fd:0xa4894ce03534c510!8m2!3d21.0496984!4d105.7931702!16s%2Fg%2F11hdh634nz?hl=vi&entry=ttu&g_ep=EgoyMDI1MDkyOS4wIKXMDSoASAFQAw%3D%3D", // Placeholder cho Google Map
  Hotline: "0904.830.460",
  BookingEmail: "booking@genlive.vn",
  PartnersEmail: "partners@genlive.vn",
};
const PRIMARY_COLOR = "#b6202b";
const TEXT_DARK_COLOR = "#000000ff";

const WavingFloatingButton: React.FC = () => {
  return (
    <div className="fixed bottom-20 right-5 z-50 flex flex-col items-center space-y-4">
      {/* Nút Facebook */}
      <button
        className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl cursor-pointer transition-transform hover:scale-105 border-2 border-blue-400"
        onClick={() => window.open("https://facebook.com", "_blank")}
      >
        <FaFacebookF style={{ fontSize: 20 }} />
      </button>

      {/* Nút TikTok */}
      <button
        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-2xl cursor-pointer transition-transform hover:scale-105 border-2 border-gray-500"
        onClick={() => window.open("https://tiktok.com", "_blank")}
      >
        <FaTiktok style={{ fontSize: 20 }} />
      </button>

      {/* Nút Sóng Phone */}
      <button
        className="relative w-10 h-10 rounded-full flex items-center justify-center shadow-2xl cursor-pointer transition-transform hover:scale-105 border-3 border-pink-400"
        style={{ backgroundColor: PRIMARY_COLOR }}
        onClick={() => alert("Gọi hỗ trợ hoặc thực hiện hành động liên hệ")}
      >
        {/* Hiệu ứng sóng */}
        <div className="absolute inset-0 rounded-full">
          <span
            className="absolute inset-0 rounded-full border border-pink-600 animate-wave"
            style={{
              animationDelay: "0s",
              backgroundColor: PRIMARY_COLOR,
              opacity: 0.1,
            }}
          ></span>
          <span
            className="absolute inset-0 rounded-full border border-pink-600 animate-wave"
            style={{
              animationDelay: "1s",
              backgroundColor: PRIMARY_COLOR,
              opacity: 0.1,
            }}
          ></span>
        </div>

        <span className="text-white font-bold text-2xl relative z-10">
          <FaPhone style={{ fontSize: 20 }} />
        </span>
      </button>
    </div>
  );
};
const Footer: React.FC = () => {
  const [showCookieBanner, setShowCookieBanner] = useState(true);

  return (
    <>
      {/* Mobile App Section */}
      <section className="bg-white py-16 px-4 md:px-8 flex flex-col items-center border-t border-gray-200">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between w-full">
          {/* Left Side */}
          <div className="lg:w-1/2 flex flex-col justify-start mb-8 lg:mb-0 items-start">
            <div className="text-4xl sm:text-5xl font-black mb-6">
              LIVE
              <span style={{ color: PRIMARY_COLOR }}>STREAM</span>
              <span style={{ color: TEXT_DARK_COLOR }}> BY</span>
              <span
                className="block text-4xl sm:text-5xl"
                style={{
                  fontFamily: "cursive, sans-serif",
                  fontWeight: "lighter",
                }}
              >
                passion
              </span>
            </div>

            <button className="w-60 h-20 px-6 py-3 bg-black text-white font-semibold rounded shadow-lg hover:bg-gray-800 transition duration-300 mb-8 text-3xl">
              Get in touch
            </button>

            {/* Emails */}
            <div className="text-base text-gray-700 leading-relaxed">
              <p>
                For brands:{" "}
                <a
                  href={`mailto:${FINAL_FOOTER_DATA.BookingEmail}`}
                  className="font-semibold hover:underline"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {FINAL_FOOTER_DATA.BookingEmail}
                </a>
              </p>
              <p>
                For creators:{" "}
                <a
                  href={`mailto:${FINAL_FOOTER_DATA.PartnersEmail}`}
                  className="font-semibold hover:underline"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {FINAL_FOOTER_DATA.PartnersEmail}
                </a>
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className="lg:w-1/2 text-sm text-gray-700 leading-relaxed text-left lg:text-right">
            <p
              className="font-bold text-2xl mb-4 flex items-center whitespace-nowrap justify-end"
              style={{ color: TEXT_DARK_COLOR }}
            >
              Gen
              <FaDotCircle
                style={{
                  fontSize: 12,
                  color: PRIMARY_COLOR,
                  margin: "0 4px",
                }}
              />
              Live
            </p>

            <p className="mb-4">
              Headquarter: {FINAL_FOOTER_DATA.Headquarter}
              <span
                onClick={() =>
                  window.open(FINAL_FOOTER_DATA.GoogleMapLink, "_blank")
                }
                className="hover:underline ml-1 cursor-pointer"
                style={{ color: PRIMARY_COLOR }}
              >
                Google Map
              </span>
            </p>

            <p className="font-bold mb-6">
              Hotline:{" "}
              <span style={{ color: PRIMARY_COLOR }}>
                {FINAL_FOOTER_DATA.Hotline}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Cookie Banner */}
      {showCookieBanner && (
        <div className="sticky bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 text-center text-2xs p-3 text-gray-600 dark:text-gray-400 z-40 shadow-inner">
          <span>
            Bằng cách tiếp tục sử dụng trang web này, bạn đồng ý với{" "}
            <a
              href="#"
              className="hover:underline"
              style={{ color: PRIMARY_COLOR }}
            >
              Chính sách về thu thập và xử lý dữ liệu cá nhân
            </a>{" "}
            của chúng tôi.
          </span>
          {/* Nút đóng */}
          <button
            onClick={() => setShowCookieBanner(false)}
            className="absolute top-0 right-3 text-gray-500 hover:text-gray-800 text-lg font-bold cursor-pointer transition"
            aria-label="Đóng thông báo"
          >
            ×
          </button>
        </div>
      )}

      <WavingFloatingButton />
      <style jsx global>{`
      /* Bắt đầu phần CSS cho hiệu ứng sóng từ yêu cầu */
      @keyframes wave {
        from {
          transform: scale(0.9);
          opacity: 0.7;
        }
        to {
          transform: scale(1.8);
          opacity: 0;
        }
      }
      .animate-wave {
        animation: wave 2s infinite;
      }
      /* Kết thúc phần CSS cho hiệu ứng sóng */

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-slideIn {
        animation: slideIn 0.5s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      .animate-fadeIn {
        animation: fadeIn 1.5s ease-out;
      }
      @keyframes bounceSlow {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }
      .animate-bounceSlow {
        animation: bounceSlow 3s infinite ease-in-out;
      }
      .line-clamp-4 {
        display: -webkit-box;
        -webkit-line-clamp: 4;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      html {
        scroll-behavior: smooth;
      }
    `}</style>
    </>
  );
};
export default Footer;
