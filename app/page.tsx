import { Button } from "@/components/ui/button";
import { WorldMap } from "@/components/world-map";

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section - Two Column Layout */}
      <section className="flex items-center">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Column - Title and Description */}
            <div className="flex-1 space-y-6">
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                有些人生活在世界之中， 有些人，被世界对待。
              </p>
              <p className="text-base md:text-lg text-gray-500">
                世界地图看起来是一样的。 国界线、海岸线、颜色与名字。
                但对有些人来说， 这些线条，决定了他们是否会被当成罪犯，
                是否会被当成病人， 是否被允许牵起另一个人的手。
                这张地图，只做一件事： 把世界如何对待性少数群体，标出来。
                不评判，不煽动。 只是让你看见。
              </p>
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
