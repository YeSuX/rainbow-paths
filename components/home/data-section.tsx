import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DataSection() {
  const features = [
    { emoji: "⚖️", label: "法律进展", desc: "Legal Rights" },
    { emoji: "🏥", label: "医疗权益", desc: "Healthcare" },
    { emoji: "💍", label: "婚姻平权", desc: "Marriage Equality" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl w-full">
        <Card className="border border-[#E3E2E0] shadow-notion hover:shadow-notion-hover transition-all duration-200 bg-white rounded-md sm:rounded-lg">
          <CardHeader className="text-center pt-12 sm:pt-16 pb-6 sm:pb-8 space-y-3 sm:space-y-4">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#37352F]">
              数据背后的故事
            </CardTitle>
            <CardDescription className="text-sm sm:text-base md:text-lg text-[#787774] max-w-2xl mx-auto px-4">
              每一个颜色的变化，都是无数人努力的结果
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-12 sm:pb-16 space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
              {features.map((item) => (
                <div
                  key={item.label}
                  className="p-5 sm:p-6 rounded-md sm:rounded-lg border border-[#E3E2E0] hover:border-[#D0CFCD] hover:bg-[#F7F6F3] transition-all duration-200"
                >
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">{item.emoji}</div>
                  <div className="text-sm font-semibold text-[#37352F] mb-1">
                    {item.label}
                  </div>
                  <div className="text-xs text-[#787774]">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="text-center pt-3 sm:pt-4">
              <p className="text-xs sm:text-sm text-[#9B9A97]">
                数据来源于公开资料和国际组织报告，持续更新中
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

