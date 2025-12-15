import { WorldMap } from "@/components/world-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section - Two Column Layout */}
      <section className="flex items-center">
        <div className="container mx-auto px-6 py-12 lg:py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left Column - Title and Description */}
            <div className="lg:w-[40%] w-full">
              <div className="space-y-5">
                {/* Main Title - Notion style */}
                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                  全球 <span style={{ color: "var(--rainbow-red)" }}>L</span>
                  <span style={{ color: "var(--rainbow-orange)" }}>G</span>
                  <span style={{ color: "var(--rainbow-blue)" }}>B</span>
                  <span style={{ color: "var(--rainbow-yellow)" }}>T</span>
                  <span style={{ color: "var(--rainbow-green)" }}>Q</span>
                  <span style={{ color: "var(--rainbow-purple)" }}>+</span>{" "}
                  权利地图
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                  追踪各国去罪化、去病化与婚姻平权的法律进展
                </p>

                {/* Divider */}
                <div className="pt-2 pb-1">
                  <div className="h-px bg-gray-200" />
                </div>

                {/* Description */}
                <div className="space-y-4 text-base text-gray-600 leading-relaxed">
                  <p>同一张世界地图，对不同的人意味着不同的现实。</p>
                  <p>
                    这些线条决定了一些人能否自由生活，能否不被视为罪犯或病人，能否合法地牵起爱人的手。
                  </p>
                </div>

                {/* Tags - Notion style */}
                <div className="flex items-center gap-2 pt-2">
                  <Badge
                    variant="secondary"
                    className="text-xs font-normal bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                  >
                    🌍 Global Data
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-xs font-normal bg-gray-100 text-gray-700 hover:bg-gray-200 border-0"
                  >
                    🏳️‍🌈 Human Rights
                  </Badge>
                </div>
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="lg:w-[60%] w-full">
              <div className="w-full max-w-4xl mx-auto">
                <Image
                  className="rounded-xl"
                  src="https://plus.unsplash.com/premium_vector-1689096753612-274b36569156?q=80&w=3054&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="World Map"
                  width={800}
                  height={400}
                  unoptimized={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Section */}
      <section className="min-h-screen flex items-center justify-center bg-gray-50/30 px-6 py-20">
        <div className="max-w-4xl w-full">
          <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
            <CardHeader className="text-center pt-16 pb-8 space-y-4">
              <CardTitle className="text-3xl md:text-4xl font-bold text-gray-900">
                数据背后的故事
              </CardTitle>
              <CardDescription className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                每一个颜色的变化，都是无数人努力的结果
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-16 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {[
                  { emoji: "⚖️", label: "法律进展", desc: "Legal Rights" },
                  { emoji: "🏥", label: "医疗权益", desc: "Healthcare" },
                  { emoji: "💍", label: "婚姻平权", desc: "Marriage Equality" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-6 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50/50 transition-all"
                  >
                    <div className="text-3xl mb-3">{item.emoji}</div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">{item.desc}</div>
                  </div>
                ))}
              </div>

              <div className="text-center pt-4">
                <p className="text-sm text-gray-500">
                  数据来源于公开资料和国际组织报告，持续更新中
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
