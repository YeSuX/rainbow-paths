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
    <section className="min-h-screen flex items-center justify-center bg-white px-6 py-20">
      <div className="max-w-4xl w-full">
        <Card className="border border-[#E3E2E0] shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 bg-white">
          <CardHeader className="text-center pt-16 pb-8 space-y-4">
            <CardTitle className="text-3xl md:text-4xl font-bold text-[#37352F]">
              数据背后的故事
            </CardTitle>
            <CardDescription className="text-base md:text-lg text-[#787774] max-w-2xl mx-auto">
              每一个颜色的变化，都是无数人努力的结果
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-16 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {features.map((item) => (
                <div
                  key={item.label}
                  className="p-6 rounded-lg border border-[#E3E2E0] hover:border-[#D0CFCD] hover:bg-[#F7F6F3] transition-all duration-200"
                >
                  <div className="text-3xl mb-3">{item.emoji}</div>
                  <div className="text-sm font-semibold text-[#37352F] mb-1">
                    {item.label}
                  </div>
                  <div className="text-xs text-[#787774]">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-[#9B9A97]">
                数据来源于公开资料和国际组织报告，持续更新中
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

