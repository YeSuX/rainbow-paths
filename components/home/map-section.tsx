import { EChartsWorldMap } from "@/components/echarts-world-map";

export function MapSection() {
  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            全球法律进展地图
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            点击地图上的国家，查看详细的法律进展信息
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-6">
          <EChartsWorldMap />
        </div>
      </div>
    </section>
  );
}

