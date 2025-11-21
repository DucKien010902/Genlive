// app/jobs/page.tsx (Server Component)
import { Metadata } from "next";
import BlogsClient from "./BlogsClient";

export const metadata: Metadata = {
  title: "GENLIVE Blogs - Latest News & Insights",
  description: "Read the latest news, articles, and insights on livestreaming and digital content from GenLive.vn.",
  keywords: "GenLive, blogs, news, articles, livestream, digital content",
  icons: { icon: "/G-live-2000px.png" },
};

export default function JobsPage() {
  return <BlogsClient />;
}
