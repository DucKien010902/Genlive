"use client";

import axiosClient from "@/config/apiconfig";
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  LucideIcon,
  MapPin,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const PRIMARY_COLOR = "#b6202b";

// ====== KIỂU DỮ LIỆU ======
interface Job {
  _id: string;
  title: string;
  jobID: String;
  type: string;
  location: string;
  deadline: string;
  salary: string;
  isNegotiable: boolean;
}

interface JobDetailProps {
  icon: LucideIcon;
  text: string;
}

// ====== COMPONENT CON ======
const JobDetail: React.FC<JobDetailProps> = ({ icon: Icon, text }) => (
  <div className="flex items-center text-sm text-gray-500 mr-4 mb-1">
    <Icon className="w-4 h-4 mr-1 text-gray-500" />
    <span className="whitespace-nowrap">{text}</span>
  </div>
);

// ====== CARD CÔNG VIỆC ======
const JobCard: React.FC<{ job: Job }> = ({ job }) => {
  const { jobID,title, type, location, deadline, salary, isNegotiable } = job;
  const SalaryIcon = isNegotiable ? Briefcase : DollarSign;
  const salaryColor = isNegotiable ? "text-gray-700" : "text-[#b6202b]";
  const salaryBg = isNegotiable ? "bg-white" : "bg-red-50";
  const router = useRouter();

  return (
    <div
      className="bg-white border-2 border-red-600 rounded-xl shadow-sm hover:shadow-xl transition duration-300 p-5 flex flex-col justify-between hover:border-[var(--primary-color)]"
      style={{ "--primary-color": PRIMARY_COLOR } as React.CSSProperties}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-800 leading-snug pr-2">
          {title}
        </h3>
        <Zap className="w-5 h-5 text-green-500 flex-shrink-0" fill="rgb(34, 197, 94)" />
      </div>

      <div className="text-sm mb-4">
        <div className="flex flex-wrap mb-1">
          <JobDetail icon={Clock} text={type} />
          <JobDetail icon={MapPin} text={location} />
        </div>
        <JobDetail icon={Calendar} text={`Thời hạn: ${deadline}`} />
      </div>

      <hr className="border-t border-gray-100 mb-4" />

      <div className="flex justify-between items-center pt-2">
        <div className={`flex items-center text-base font-bold ${salaryColor}`}>
          <div className={`p-1 mr-2 rounded-full ${salaryBg} flex items-center justify-center`}>
            <SalaryIcon className="w-4 h-4 text-[#b6202b]" />
          </div>
          <span className="text-sm">{salary}</span>
        </div>

        <button
          className="px-4 py-2 text-sm font-medium border rounded-lg transition duration-150 active:scale-[.98] cursor-pointer"
          style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = PRIMARY_COLOR;
          }}
          onClick={() => router.push(`/jobs?jobID=${jobID}&title=${title}`)}
        >
          Ứng Tuyển
        </button>
      </div>
    </div>
  );
};

// ====== TRANG CHÍNH ======
const ContactPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosClient.get("/jobs/getalljobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Lỗi lấy jobs:", error);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div
  className="min-h-screen p-4 sm:p-8 font-inter mt-16 bg-cover bg-center bg-no-repeat"
  style={{
    backgroundImage:
      "url('https://png.pngtree.com/background/20250607/original/pngtree-red-and-white-abstract-background-template-design-vector-picture-image_16630261.jpg')",
    backgroundSize: "125%", // ✅ phóng to nền 10%
    backgroundPosition: "center", // ✅ vẫn giữa màn hình
  }}
>
      {/* Tiêu đề giữa trang */}
      <header className="text-center mb-12 mt-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-5" style={{ color: PRIMARY_COLOR }}>
          Cơ Hội Nghề Nghiệp Hấp Dẫn Tại GenLive
        </h1>
        <p className="text-yellow-900 max-w-2xl mx-auto text-base">
          Gia nhập đội ngũ chuyên nghiệp, năng động và cùng bạn phát triển sự nghiệp bền vững.
          Hãy chọn công việc phù hợp và bắt đầu hành trình mới ngay hôm nay!
        </p>
      </header>

      <main className="max-w-6xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => <JobCard key={job._id} job={job} />)
          ) : (
            <p className="text-center col-span-3 text-gray-600">⏳ Đang tải dữ liệu...</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ContactPage;
