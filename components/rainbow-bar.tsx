"use client";

import { motion } from "framer-motion";

interface RainbowBarProps {
  animated?: boolean;
  height?: number;
}

/**
 * 彩虹装饰条组件
 * 位于页面顶部的 2px 渐变装饰条，传递品牌识别和情感连接（Notion 风格）
 */
export function RainbowBar({ animated = true, height = 2 }: RainbowBarProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        height: `${height}px`,
        background: `linear-gradient(
          90deg,
          #eb5757 0%,
          #f2994a 16.67%,
          #f2c94c 33.33%,
          #6fcf97 50%,
          #56ccf2 66.67%,
          #bb6bd9 83.33%,
          #eb5757 100%
        )`,
        backgroundSize: animated ? "200% 100%" : "100% 100%",
      }}
      initial={{ opacity: 0, y: -height }}
      animate={{
        opacity: 1,
        y: 0,
        backgroundPosition: animated ? ["0% 50%", "200% 50%"] : "0% 50%",
      }}
      transition={{
        opacity: { duration: 0.3, ease: "easeOut" },
        y: { duration: 0.3, ease: "easeOut" },
        backgroundPosition: {
          duration: 8,
          ease: "linear",
          repeat: Infinity,
        },
      }}
      aria-hidden="true"
    />
  );
}
