"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Github, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useNavbarScroll } from "@/hooks/use-navbar-scroll";

/**
 * 导航栏组件
 * 设计要求：
 * - 高度 64px
 * - 背景：透明 → 滚动后白色 + 阴影
 * - 布局：[Logo + Rainbow Paths] [关于] [GitHub]
 * - 移动端：汉堡菜单
 */
export function Navbar() {
  const isScrolled = useNavbarScroll(10);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0, y: -64 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div
        className={`max-w-7xl mx-auto transition-all duration-300 ${
          isScrolled
            ? "bg-white/90 backdrop-blur-lg shadow-[0_2px_8px_rgba(0,0,0,0.06)] rounded-2xl mt-2"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Logo + 品牌名 */}
          <Button
            variant="ghost"
            className="gap-2 px-3 hover:bg-[#F7F6F3] text-[#37352F] h-11 min-w-[44px]"
            asChild
          >
            <Link href="/" onClick={closeMobileMenu}>
              <span className="text-2xl" role="img" aria-label="rainbow">
                🌈
              </span>
              <span className="text-base sm:text-lg font-semibold">
                在世界之中
              </span>
            </Link>
          </Button>

          {/* 桌面端导航链接 */}
          <div className="hidden md:flex items-center gap-1 text-[#37352F]">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 min-w-[44px]"
              asChild
            >
              <Link href="/updates">
                <span>
                  <Newspaper className="w-4 h-4" />
                </span>
                最新动态
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 min-w-[44px]"
              asChild
            >
              <Link
                href="https://github.com/YeSuX/rainbow-paths"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  <Github className="w-4 h-4" />
                </span>
                GitHub
              </Link>
            </Button>
          </div>

          {/* 移动端汉堡菜单 */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="md:hidden h-11 w-11 min-w-[44px] min-h-[44px]"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px]">
              <SheetHeader>
                <SheetTitle></SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 text-[#37352F] mt-4">
                <Button
                  variant="ghost"
                  className="justify-start gap-2 h-12 min-h-[44px]"
                  asChild
                  onClick={closeMobileMenu}
                >
                  <Link href="/updates">
                    <span>
                      <Newspaper className="w-4 h-4" />
                    </span>
                    最新动态
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2 h-12 min-h-[44px]"
                  asChild
                  onClick={closeMobileMenu}
                >
                  <Link
                    href="https://github.com/YeSuX/rainbow-paths"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>
                      <Github className="w-4 h-4" />
                    </span>
                    GitHub
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.nav>
  );
}
