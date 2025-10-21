"use client";
import axiosClient from "@/config/apiconfig";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PRIMARY_COLOR = "#b6202b";

// --- PHẦN 1: DỮ LIỆU MẪU ---


// --- ICON COMPONENT ---
interface IconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({ name, className = "w-5 h-5" }) => {
  const icons: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
    MapPin: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    Clock: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    Building: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="2" width="18" height="20" rx="2" ry="2" />
        <line x1="9" y1="18" x2="9" y2="10" />
        <line x1="15" y1="18" x2="15" y2="10" />
      </svg>
    ),
    Users: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    Wallet: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v-2" />
        <path d="M20 7v3H8a2 2 0 0 1 0-4h12" />
      </svg>
    ),
    Calendar: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <rect width="18" height="18" x="3" y="4" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    CalendarCheck: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
        <path d="M9 14l2 2l4-4" />
      </svg>
    ),
    User: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    Mail: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    Smartphone: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
    Phone: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.08 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    Facebook: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    Linkedin: (props) => (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M16 8a6 6 0 0 0-6 6v7H6v-7a6 6 0 0 1 12 0v7h-4M2 9v7H6v-7H2Z" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  };
  const RequestedIcon = icons[name];
  return RequestedIcon ? <RequestedIcon className={className} /> : null;
};

// --- COMPONENTS NHỎ ---
const InfoItem = ({ iconName, label, value }: any) => (
  <div className="flex items-center space-x-4 p-4">
    <div className="flex-shrink-0" style={{ color: PRIMARY_COLOR }}>
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

// --- COMPONENT CHÍNH ---

interface JobDetailType {
  title?: string;
  meta?: { icon: string; text: string }[];
  info?: { label: string; value: string; icon: string }[];
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

const JobPostingFull = () => {
  const searchParams = useSearchParams();
  const [jobData, setJobData] = useState<JobDetailType | null>(null);

  const jobID = searchParams.get("jobID");

  const getJobData = async () => {
    if (!jobID) return; // ✅ không có jobID thì không gọi API
    try {
      const res = await axiosClient.get(`/jobdetail/getjobdetail?jobID=${jobID}`);
      setJobData(res.data);
    } catch (error) {
      console.error("❌ Cannot get jobdetail:", error);
    }
  };

  useEffect(() => {
    getJobData();
  }, [jobID]);

  if (!jobData) {
    return <div>Đang tải dữ liệu công việc...</div>;
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
    referenceTitle,
    references,
    contactTitle,
    contact,
  } = jobData;

  return (
    <div
      className="min-h-screen p-4 sm:p-8 md:p-12 lg:p-16 flex justify-center mt-12 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20250607/original/pngtree-red-and-white-abstract-background-template-design-vector-picture-image_16630261.jpg')",
      }}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6 sm:p-8 md:p-10 border"
        style={{ borderColor: PRIMARY_COLOR + "33" }}
      >
        {/* Header */}
        <header
          className="mb-8 border-b pb-4"
          style={{ borderColor: PRIMARY_COLOR + "55" }}
        >
          <h1
            className="text-2xl sm:text-3xl font-bold uppercase mb-2 leading-tight"
            style={{ color: PRIMARY_COLOR }}
          >
            {title}
          </h1>
          <div className="flex space-x-4 text-sm text-gray-500">
            {meta?.map((item, index) => (
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

        {/* Info */}
        <section className="mb-10">
          <h2
            className="text-xl font-bold mb-4"
            style={{ color: PRIMARY_COLOR }}
          >
            Thông tin công việc
          </h2>
          <div
            className="bg-white rounded-lg border p-4"
            style={{ borderColor: PRIMARY_COLOR + "33" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4">
              {info?.map((item, index) => (
                <InfoItem
                  key={index}
                  iconName={item.icon}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="mb-10">
          <SectionHeader>{descriptionTitle}</SectionHeader>
          <DetailList items={description} />
        </section>

        <section className="mb-10">
          <SectionHeader>{requirementsTitle}</SectionHeader>
          <DetailList items={requirements} />
        </section>

        <section className="mb-10">
          <SectionHeader>{benefitsTitle}</SectionHeader>
          <DetailList items={benefits} />
        </section>

        <section className="mb-10">
          <SectionHeader>{referenceTitle}</SectionHeader>
          <ul className="list-none space-y-3 pl-0">
            {references?.map((ref: any, index: number) => (
              <li
                key={index}
                className="flex items-start text-gray-700 leading-relaxed"
              >
                <span
                  className="mr-3 font-bold"
                  style={{ color: PRIMARY_COLOR }}
                >
                  -
                </span>
                <span>
                  {ref.label}{" "}
                  <a
                    href={ref.url}
                    className="font-semibold underline"
                    style={{ color: PRIMARY_COLOR }}
                  >
                    {ref.linkText}
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h3
            className="text-lg font-bold mb-4"
            style={{ color: PRIMARY_COLOR }}
          >
            {contactTitle}
          </h3>
          <div
            className="bg-white rounded-lg border p-6"
            style={{ borderColor: PRIMARY_COLOR + "33" }}
          >
            <div className="grid grid-cols-1 gap-4">
              {/* Dòng 1 - full width */}
              <ContactItem
                iconName="User"
                label="Người phụ trách"
                value={contact?.person}
              />

              {/* Dòng 2 - 2 cột */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ContactItem
                  iconName="Smartphone"
                  label="SĐT di động"
                  value={contact?.mobile}
                />
                <ContactItem
                  iconName="Mail"
                  label="Email"
                  value={contact?.email}
                />
              </div>
            </div>
          </div>
        </section>

        <footer className="py-4 flex justify-between items-center mt-6">
          <button
            className="text-white font-semibold py-2 px-6 rounded-lg transition duration-300 shadow-md"
            style={{ backgroundColor: PRIMARY_COLOR }}
          >
            Nộp hồ sơ
          </button>
          <div className="flex items-center space-x-3">
            <span className="text-gray-600">Chia sẻ</span>
            <a
              href="#"
              className="text-white p-2 rounded-full transition"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <Icon name="Facebook" className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-white p-2 rounded-full transition"
              style={{ backgroundColor: PRIMARY_COLOR }}
            >
              <Icon name="Linkedin" className="w-5 h-5" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default JobPostingFull;
