import type { Metadata } from "next";
import "./globals.css";
import { RainbowBar } from "@/components/rainbow-bar";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: "Rainbow Paths - 爱的地图，温暖前行",
  description: "全球婚姻平权政策地图，找到欢迎你们的地方",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {/* <RainbowBar animated /> */}
        <Navbar />
        {children}
      </body>
    </html>
  );
}
