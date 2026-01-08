import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export function DataSection() {
  const features = [
    { emoji: "⚖️", label: "法律进展", desc: "Legal Rights" },
    { emoji: "🏥", label: "医疗权益", desc: "Healthcare" },
    { emoji: "💍", label: "婚姻平权", desc: "Marriage Equality" },
  ];

  const videos = [
    { bvid: "BV1wNiMBUEgi" },
    { bvid: "BV1pz4y187eN" },
    { bvid: "BV1ot4y1u7ry" },
    { bvid: "BV1BV4y1N7P9" },
    { bvid: "BV1zmKtz1Eaq" },
    { bvid: "BV13KDYY1EfY" },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 py-12 sm:py-16 md:py-20">
      <div className="max-w-6xl w-full space-y-8 sm:space-y-12">
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
                  <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">
                    {item.emoji}
                  </div>
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

        <Card className="border border-[#E3E2E0] shadow-notion hover:shadow-notion-hover transition-all duration-200 bg-white rounded-md sm:rounded-lg">
          <CardHeader className="text-center pt-8 sm:pt-12 pb-6 sm:pb-8 space-y-3 sm:space-y-4">
            <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-[#37352F]">
              故事分享
            </CardTitle>
            <CardDescription className="text-sm sm:text-base text-[#787774] max-w-2xl mx-auto px-4">
              聆听来自世界各地的真实故事
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-12 sm:pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {videos.map((video) => (
                <Card
                  key={video.bvid}
                  className="border border-[#E3E2E0] overflow-hidden hover:shadow-notion-hover transition-all duration-200"
                >
                  <AspectRatio ratio={16 / 9}>
                    <iframe
                      src={`//player.bilibili.com/player.html?isOutside=true&autoplay=0&bvid=${video.bvid}&page=1`}
                      scrolling="no"
                      className="w-full h-full border-0"
                      allowFullScreen
                      title={`Bilibili 视频 ${video.bvid}`}
                    />
                  </AspectRatio>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
