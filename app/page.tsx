import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <div className="pt-20">
      {/* 为导航栏和彩虹条留出空间 */}
      <Hero />

      {/* 后续内容区域 */}
      <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-white to-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">更多精彩内容</h2>
          <p className="mt-4 text-gray-600">滚动查看导航栏效果</p>
        </div>
      </div>
    </div>
  );
}
