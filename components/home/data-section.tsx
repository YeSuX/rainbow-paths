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
              {features.map((item) => (
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
  );
}

