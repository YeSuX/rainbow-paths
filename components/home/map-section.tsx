import { EChartsWorldMap } from "@/components/echarts-world-map";

export function MapSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-[#F7F6F3]">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#37352F] mb-3 sm:mb-4">
            全球法律进展地图
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-[#787774] max-w-2xl mx-auto px-4">
            点击地图上的国家，查看详细的法律进展信息
          </p>
        </div>
        <div className="bg-white rounded-md sm:rounded-lg border border-[#E3E2E0] shadow-notion hover:shadow-notion-hover transition-all duration-200 p-4 sm:p-6">
          <EChartsWorldMap />
        </div>
      </div>
    </section>
  );
}

