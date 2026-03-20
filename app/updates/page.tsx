import type { Metadata } from "next";
import { UpdatesPageClient } from "@/components/updates/updates-page-client";

export const metadata: Metadata = {
  title: "最新动态 - Rainbow Paths",
  description: "追踪全球婚姻平权的最新进展和里程碑事件",
};

export default function UpdatesPage() {
  return <UpdatesPageClient />;
}
