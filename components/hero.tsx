"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/**
 * Hero 区域组件
 * 设计要求：
 * - 首屏完整呈现，3 秒传达核心价值
 * - 圆角、毛玻璃效果
 * - 彩虹渐变 CTA 按钮
 * - 柔和、不尖锐的视觉风格
 */
export function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
      {/* 背景装饰 - 微妙的几何图案 */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-100/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-50/30 rounded-full blur-3xl" />
      </div>

      {/* 主内容容器 - 毛玻璃卡片 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto w-full"
      >
        <div className="relative bg-white/60 backdrop-blur-xl rounded-[32px] shadow-xl border border-white/40 p-8 sm:p-12 lg:p-16">
          {/* 产品定位 */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-sm sm:text-base text-gray-500 text-center mb-4 font-medium tracking-wide"
          >
            全球婚姻平权政策地图
          </motion.p>

          {/* 主标题 */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 text-center mb-12 leading-tight"
          >
            找到欢迎你们的地方
          </motion.h1>

          {/* 主 CTA 按钮 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <button className="group relative h-16 px-12 bg-gradient-to-r from-green-400 via-blue-400 to-blue-500 text-white text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 overflow-hidden">
              {/* 按钮光泽效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

              <span className="relative flex items-center space-x-2">
                <span>查看全球政策地图</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </button>
          </motion.div>

          {/* 信任背书 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm sm:text-base text-gray-600 font-medium">
              <span className="inline-flex items-center space-x-2">
                <span>35+ 国家/地区</span>
                <span className="text-gray-400">·</span>
                <span>完全免费</span>
                <span className="text-gray-400">·</span>
                <span>公益项目</span>
              </span>
            </p>
          </motion.div>

          {/* 装饰性彩虹小点 */}
          <div className="absolute -top-3 -right-3 w-20 h-20 bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 rounded-full blur-xl opacity-40" />
          <div className="absolute -bottom-3 -left-3 w-24 h-24 bg-gradient-to-tr from-green-300 via-blue-300 to-cyan-300 rounded-full blur-xl opacity-40" />
        </div>

        {/* 次要信息卡片 - 可选 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-8 flex flex-wrap justify-center gap-4 px-4"
        >
          {[
            { emoji: "🌍", text: "覆盖全球" },
            { emoji: "📊", text: "实时更新" },
            { emoji: "💝", text: "开源透明" },
          ].map((item, index) => (
            <div
              key={index}
              className="group bg-white/40 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/30 hover:bg-white/60 hover:border-white/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center space-x-2">
                <span className="text-2xl" role="img">
                  {item.emoji}
                </span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  {item.text}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
