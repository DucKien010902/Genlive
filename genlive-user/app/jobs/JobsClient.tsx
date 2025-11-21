"use client";

import axiosClient from "@/config/apiconfig";
import {
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  LucideIcon,
  MapPin,
  X, // Icon đóng modal
  Zap,
  // Import các icon cần thiết cho Dynamic Icon (nếu cần mapping thủ công)
  Wallet,
  Gift,
  User,
  Smartphone,
  Mail,
  Facebook,
  Linkedin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
// @ts-ignore
import slugify from "slugify";

const PRIMARY_COLOR = "#b6202b";

// =====================================================
// 1. ĐỊNH NGHĨA TYPE & INTERFACE
// =====================================================

interface Job {
  _id: string;
  title: string;
  jobID: String;
  type: string;
  location: string;
  deadline: string;
  salary: string;
  isNegotiable: boolean;
  numberApply: Number;
  isHot: boolean;
}

interface JobDetailType {
  title?: string;
  meta?: { icon: string; text: string }[];
  info?: {
    salary: String;
    bonus: String;
    classify: String;
    timework: String;
    place: String;
  };
  descriptionTitle?: string;
  description?: string[];
  requirementsTitle?: string;
  requirements?: string[];
  benefitsTitle?: string;
  benefits?: string[];
  referenceTitle?: string;
  references?: { label: string; url: string; linkText: string }[];
  contactTitle?: string;
  contact?: {
    person?: string;
    email?: string;
    mobile?: string;
    phone?: string;
  };
}

interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

// =====================================================
// 2. HELPER COMPONENTS (ICON, LIST ITEM...)
// =====================================================

// --- Placeholder cho Icon Component của bạn ---
// Bạn hãy thay thế hoặc paste logic mapping icon của bạn vào đây
const Icon: React.FC<IconProps> = ({ name, className, style }) => {
  // Mapping tạm thời để code chạy được visualize
  const icons: any = {
    Wallet: Wallet,
    Gift: Gift,
    Calendar: Calendar,
    Clock: Clock,
    MapPin: MapPin,
    User: User,
    Smartphone: Smartphone,
    Mail: Mail,
    Facebook: Facebook,
    Linkedin: Linkedin,
  };
  const TheIcon = icons[name] || Zap; // Default fallback
  return <TheIcon className={className} style={style} />;
};

const JobDetailIconItem: React.FC<{ icon: LucideIcon; text: string }> = ({
  icon: Icon,
  text,
}) => (
  <div className="flex items-center text-sm text-gray-500 mr-4 mb-1">
    <Icon className="w-4 h-4 mr-1 text-gray-500" />
    <span className="whitespace-nowrap">{text}</span>
  </div>
);

const InfoItem = ({ iconName, label, value }: any) => (
  <div className="flex space-x-4 p-0 sm:p-4">
    <div className="md:flex-shrink-0 md:flex" style={{ color: PRIMARY_COLOR }}>
      <Icon name={iconName} className="w-5 h-5" />
    </div>
    <div className="flex flex-col flex-grow min-w-0">
      <span className="text-sm text-gray-500 truncate">{label}</span>
      <span className="font-semibold text-gray-800 text-base">{value}</span>
    </div>
  </div>
);

const SectionHeader = ({ children }: any) => (
  <h2
    className="text-xl font-bold mb-4 pt-8 md:pt-10 border-b pb-1"
    style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
  >
    {children}
  </h2>
);

const DetailList = ({ items }: any) => (
  <ul className="list-none space-y-3 pl-0">
    {items?.map((item: string, index: number) => (
      <li
        key={index}
        className="flex items-start text-gray-700 leading-relaxed"
      >
        <span className="mr-3 font-bold" style={{ color: PRIMARY_COLOR }}>
          -
        </span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const ContactItem = ({ iconName, label, value }: any) => (
  <div className="flex items-center space-x-3 text-gray-700 w-full">
    <Icon
      name={iconName}
      className="w-5 h-5 flex-shrink-0"
      style={{ color: PRIMARY_COLOR }}
    />
    <span className="font-semibold text-sm sm:text-base whitespace-nowrap">
      {label}:
    </span>
    <span className="truncate text-sm sm:text-base">{value}</span>
  </div>
);

// =====================================================
// 3. COMPONENT: JOB CARD
// =====================================================

interface JobCardProps {
  job: Job;
  onSelect: (job: Job) => void; // Thay đổi: Nhận function onSelect
}

const JobCard: React.FC<JobCardProps> = ({ job, onSelect }) => {
  const { title, type, location, deadline, salary, isNegotiable, isHot } = job;
  const SalaryIcon = isNegotiable ? Briefcase : DollarSign;
  const salaryColor = isNegotiable ? "text-gray-700" : "text-[#b6202b]";
  const salaryBg = isNegotiable ? "bg-white" : "bg-red-50";
  
  // Style viền
  const cardStyle = isHot
    ? "border-2 border-red-600"
    : "border border-gray-200";

  return (
    <div
      className={`relative overflow-hidden bg-white rounded-xl shadow-sm hover:shadow-xl
                  transition duration-300 p-5 flex flex-col h-full cursor-pointer
                  hover:border-[var(--primary-color)] ${cardStyle}`}
      style={{ "--primary-color": PRIMARY_COLOR } as React.CSSProperties}
      onClick={() => onSelect(job)} // Click vào card cũng mở modal
    >
      {isHot && (
        <div
          className="absolute top-3 right-[-30px] w-[110px] rotate-45 transform 
                      py-1 text-center text-xs font-semibold text-white shadow-md"
          style={{ backgroundColor: PRIMARY_COLOR }}
        >
          🔥 HOT
        </div>
      )}

      {/* Nội dung trên */}
      <div className="flex flex-col flex-grow justify-start h-[108px]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 leading-snug pr-2">
            {title}
          </h3>
          {!isHot && (
            <Zap
              className="w-6 h-6 text-red-500 flex-shrink-0 "
              fill="rgba(197, 78, 34, 1)"
            />
          )}
        </div>

        <div className="text-sm">
          <div className="flex flex-wrap mb-1">
            <JobDetailIconItem icon={Clock} text={type} />
            <JobDetailIconItem icon={MapPin} text={location} />
          </div>
          <JobDetailIconItem icon={Calendar} text={`Duration: ${deadline}`} />
        </div>
      </div>

      <hr className="border-t border-gray-100 my-4" />

      {/* Phần dưới: Lương + Nút Apply */}
      <div className="flex justify-between items-start pt-2 h-[64px]">
        <div
          className={`flex items-start text-base font-bold ${salaryColor} flex-1 min-w-0`}
        >
          <div
            className={`p-1 mr-2 rounded-full ${salaryBg} flex items-center justify-center flex-shrink-0`}
          >
            <SalaryIcon className="w-4 h-4 text-[#b6202b]" />
          </div>
          <span className="text-sm break-words">{salary}</span>
        </div>

        <button
          className="px-4 py-2 text-sm font-medium border rounded-lg transition duration-150
                     active:scale-[.98] cursor-pointer flex-shrink-0 ml-2"
          style={{ borderColor: PRIMARY_COLOR, color: PRIMARY_COLOR }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = PRIMARY_COLOR;
            e.currentTarget.style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = PRIMARY_COLOR;
          }}
          onClick={(e) => {
            e.stopPropagation(); // Ngăn sự kiện click card (tránh kích hoạt 2 lần nếu cần)
            window.open(
                      "https://docs.google.com/forms/d/e/1FAIpQLSdTTRLui7A5l_VCR7SUZVFK-p3OfcDsnVaUMP2qSzsp4oa1qw/viewform?usp=sharing&ouid=113657380263204721080",
                      "_blank"
                    );
          }}
          
        >
          Apply
        </button>
      </div>
    </div>
  );
};

// =====================================================
// 4. COMPONENT: JOB DETAIL MODAL (POPUP)
// =====================================================

interface JobDetailModalProps {
  jobId: string; // ID để gọi API
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ jobId, onClose }) => {
  const [jobData, setJobData] = useState<JobDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobData = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/jobdetail/${jobId}`);
        setJobData(res.data);
      } catch (error) {
        console.error("❌ Cannot get jobdetail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) getJobData();
  }, [jobId]);

  // Ngăn cuộn trang background khi modal mở
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Xử lý click ra ngoài content để đóng
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      {/* Modal Container */}
      <div
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition z-10"
        >
          <X className="w-6 h-6 text-gray-600" />
        </button>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto p-6 sm:p-8 md:p-10 custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{borderColor: `${PRIMARY_COLOR} transparent transparent transparent`}}></div>
              <p className="text-gray-500">Đang tải thông tin chi tiết...</p>
            </div>
          ) : !jobData ? (
            <div className="text-center py-20 text-gray-500">
              Không tìm thấy thông tin công việc.
            </div>
          ) : (
            // === NỘI DUNG CHI TIẾT (Lấy từ component cũ) ===
            <>
              {/* Header */}
              <header
                className="mb-8 border-b pb-4 pr-10"
                style={{ borderColor: PRIMARY_COLOR + "55" }}
              >
                <h1
                  className="text-2xl sm:text-3xl font-bold uppercase mb-2 leading-tight"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {jobData.title}
                </h1>
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                  {jobData.meta?.map((item, index) => (
                    <div key={index} className="flex items-center space-x-1.5">
                      <Icon
                        name={item.icon}
                        className="w-4 h-4"
                        style={{ color: PRIMARY_COLOR }}
                      />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </header>

              {/* Info Grid */}
              <section className="mb-10">
                <h2
                  className="text-xl sm:text-2xl font-bold mb-4"
                  style={{ color: PRIMARY_COLOR }}
                >
                  Job Information
                </h2>
                <div
                  className="bg-white rounded-lg sm:border p-0 sm:p-4"
                  style={{ borderColor: PRIMARY_COLOR + "33" }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4">
                    <InfoItem
                      iconName="Wallet"
                      label="Salary:"
                      value={jobData.info?.salary}
                    />
                    <InfoItem
                      iconName="Gift"
                      label="Bonus:"
                      value={jobData.info?.bonus}
                    />
                    <InfoItem
                      iconName="Calendar"
                      label="Classify:"
                      value={jobData.info?.classify}
                    />
                    <InfoItem
                      iconName="Clock"
                      label="Timework:"
                      value={jobData.info?.timework}
                    />
                    <InfoItem
                      iconName="MapPin"
                      label="Place:"
                      value={jobData.info?.place}
                    />
                  </div>
                </div>
              </section>

              {/* Description & Requirements */}
              <section className="mb-10">
                <SectionHeader>{jobData.descriptionTitle}</SectionHeader>
                <DetailList items={jobData.description} />
              </section>

              <section className="mb-10">
                <SectionHeader>{jobData.requirementsTitle}</SectionHeader>
                <DetailList items={jobData.requirements} />
              </section>

              <section className="mb-10">
                <SectionHeader>{jobData.benefitsTitle}</SectionHeader>
                <DetailList items={jobData.benefits} />
              </section>

              {/* Contact Info */}
              <section className="mb-10">
                <h3
                  className="text-lg sm:text-xl font-bold mb-4"
                  style={{ color: PRIMARY_COLOR }}
                >
                  {jobData.contactTitle}
                </h3>
                <div
                  className="bg-white rounded-lg border p-6"
                  style={{ borderColor: PRIMARY_COLOR + "33" }}
                >
                  <div className="grid grid-cols-1 gap-4">
                    <ContactItem
                      iconName="User"
                      label="Person in charge"
                      value={jobData.contact?.person}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ContactItem
                        iconName="Smartphone"
                        label="PhoneNumber"
                        value='033 2867490'
                      />
                      <ContactItem
                        iconName="Mail"
                        label="Email"
                        value='hr@genlive.vn'
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer Actions */}
              <footer className="py-4 flex flex-col sm:flex-row justify-between items-center mt-6 gap-6 border-t pt-6">
                <button
                  className="text-white font-semibold py-3 px-8 rounded-lg transition duration-300 shadow-md w-full sm:w-auto cursor-pointer hover:opacity-90 active:scale-95"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                  onClick={() => {
                    window.open(
                      "https://docs.google.com/forms/d/e/1FAIpQLSdTTRLui7A5l_VCR7SUZVFK-p3OfcDsnVaUMP2qSzsp4oa1qw/viewform?usp=sharing&ouid=113657380263204721080",
                      "_blank"
                    );
                  }}
                >
                  Apply Now
                </button>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">Share</span>
                  <a
                    href="#"
                    className="text-white p-2 rounded-full transition hover:opacity-80"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  >
                    <Icon name="Facebook" className="w-5 h-5" />
                  </a>
                  <a
                    href="#"
                    className="text-white p-2 rounded-full transition hover:opacity-80"
                    style={{ backgroundColor: PRIMARY_COLOR }}
                  >
                    <Icon name="Linkedin" className="w-5 h-5" />
                  </a>
                </div>
              </footer>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// 5. TRANG CHÍNH (JOBS LIST PAGE)
// =====================================================

const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  // State lưu ID công việc đang xem chi tiết (null = không xem)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get("/jobs");
        const sorted = res.data.sort(
          (a: Job, b: Job) => Number(a.jobID) - Number(b.jobID)
        );
        setJobs(sorted);
      } catch (error) {
        console.error("Lỗi lấy jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Hàm mở modal
  const handleSelectJob = (job: Job) => {
    // Chúng ta dùng jobID (String trong DB) để gọi API detail
    setSelectedJobId(job.jobID.toString()); 
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setSelectedJobId(null);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 font-inter mt-16 bg-white  bg-cover bg-center bg-no-repeat bg-fixed relative"
    // style={{
    //   backgroundSize: "70%",
    //   backgroundImage:"url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl2TEKw8VsUFwZMle0XSZaWdAq7U7y4QaCtA&s')"
    // }}
    
    >
      {/* Header Page */}
      <header className="text-center mb-12 mt-12">
        <h1
          className="text-3xl sm:text-4xl font-extrabold mb-5"
          style={{ color: PRIMARY_COLOR }}
        >
          Attractive Career Opportunities at GenLive
        </h1>
        <p className="text-yellow-900 max-w-2xl mx-auto text-base">
          Join our professional, dynamic team and develop a sustainable career
          with you. Choose the right job and start your new journey today!
        </p>
      </header>

      {/* Jobs Grid */}
      <main className="max-w-6xl mx-auto mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
             // Skeleton loading đơn giản
             Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
             ))
          ) : jobs.length > 0 ? (
            jobs.map((job) => (
              <JobCard 
                key={job._id} 
                job={job} 
                onSelect={handleSelectJob} // Truyền hàm xử lý click
              />
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-600">
              Hiện chưa có công việc nào.
            </p>
          )}
        </div>
      </main>

      {/* --- MODAL HIỂN THỊ CHI TIẾT --- */}
      {selectedJobId && (
        <JobDetailModal 
          jobId={selectedJobId} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
};

export default JobsPage;