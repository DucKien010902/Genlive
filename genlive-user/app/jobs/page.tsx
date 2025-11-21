// app/jobs/page.tsx (Server Component)
import { Metadata } from "next";
import JobsClient from "./JobsClient";

export const metadata: Metadata = {
  title: "GENLIVE Jobs - Careers & Opportunities",
  description: "Explore career opportunities at GenLive.vn, a leading livestream and digital content platform connecting creators and audiences.",
  keywords: "GenLive, jobs, careers, digital content, livestream",
  icons: { icon: "/G-live-2000px.png" },
};

export default function JobsPage() {
  return <JobsClient />;
}
