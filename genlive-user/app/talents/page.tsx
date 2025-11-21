// app/jobs/page.tsx (Server Component)
import { Metadata } from "next";
import TalentsClient from "./TalentsClient";

export const metadata: Metadata = {
  title: "GENLIVE Talents - Discover Top Creators",
  description: "Explore and connect with talented creators on GenLive.vn, a leading livestream and digital content platform.",
  keywords: "GenLive, talents, creators, livestream, digital content",
  icons: { icon: "/G-live-2000px.png" },
};

export default function JobsPage() {
  return <TalentsClient />;
}
