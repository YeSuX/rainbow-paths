import { Button } from "@/components/ui/button";
import { WorldMap } from "@/components/world-map";

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section - Two Column Layout */}
      <section className="min-h-[calc(100vh-5rem)] flex items-center">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Column - Title and Description */}
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Rainbow Paths
              </h1>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                探索世界的精彩旅程从这里开始。通过可视化的方式，记录和分享你走过的每一段旅程，
                用色彩斑斓的路径绘制属于你的世界地图。
              </p>
              <p className="text-base md:text-lg text-gray-500">
                无论是商务出差、休闲旅行，还是探险冒险，每一次移动都值得被记录。
                让我们一起发现这个世界的美好，创造独特的旅行记忆。
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Button className="px-6 py-3">开始探索</Button>
                <Button className="px-6 py-3">了解更多</Button>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="flex-1 w-full flex justify-center items-center">
              <div className="w-full max-w-2xl">
                <WorldMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Content Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-800">更多精彩内容</h2>
          <p className="mt-4 text-gray-600">滚动查看导航栏效果</p>
        </div>
      </section>
    </div>
  );
}
