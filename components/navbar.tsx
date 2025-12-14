"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

/**
 * 导航栏组件
 * 设计要求：
 * - 高度 64px
 * - 背景：透明 → 滚动后白色 + 阴影
 * - 布局：[Logo + Rainbow Paths] [关于] [GitHub]
 * - 移动端：汉堡菜单
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8"
      style={{ marginTop: "4px" }} // 为彩虹条留出空间
      initial={{ opacity: 0, y: -64 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div
        className={`max-w-7xl mx-auto transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg rounded-2xl mt-2"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Logo + 品牌名 */}
          <Button
            variant="ghost"
            className="gap-2 px-3 hover:bg-blue-50/50"
            asChild
          >
            <Link href="/" onClick={closeMobileMenu}>
              <span className="text-2xl" role="img" aria-label="rainbow">
                🌈
              </span>
              <span className="text-lg font-semibold">Rainbow Paths</span>
            </Link>
          </Button>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/about">关于</Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <a
                href="https://github.com/your-repo/rainbow-paths"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            </Button>
          </div>

          {/* 移动端汉堡菜单 */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <div className="flex flex-col gap-4 mt-8">
                <Button
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={closeMobileMenu}
                >
                  <Link href="/about">关于</Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  asChild
                  onClick={closeMobileMenu}
                >
                  <a
                    href="https://github.com/your-repo/rainbow-paths"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
