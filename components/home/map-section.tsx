import { EChartsWorldMap } from "@/components/echarts-world-map";

export function MapSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#F7F6F3]">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#37352F] mb-4">
            全球法律进展地图
          </h2>
          <p className="text-base md:text-lg text-[#787774] max-w-2xl mx-auto">
            点击地图上的国家，查看详细的法律进展信息
          </p>
        </div>
        <div className="bg-white rounded-lg border border-[#E3E2E0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 p-6">
          <EChartsWorldMap />
        </div>
      </div>
    </section>
  );
}

