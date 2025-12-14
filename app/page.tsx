import { WorldMap } from "@/components/world-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="pt-16">
      {/* Hero Section - Two Column Layout */}
      <section className="flex items-center">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left Column - Title and Description */}
            <div className="lg:w-[35%] w-full">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pb-3">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge
                      variant="outline"
                      className="text-xs text-gray-400 border-gray-200"
                    >
                      🌍 Global Perspective
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-50 text-gray-400"
                    >
                      🏳️‍🌈 LGBTQ+ Rights
                    </Badge>
                  </div>
                  <CardTitle className="text-lg md:text-xl text-gray-500 font-normal leading-relaxed">
                    查看全球各国去罪化、去病化与同性婚姻的法律状态
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-0 space-y-3">
                  <Separator className="bg-gray-100" />
                  <CardDescription className="text-sm md:text-base text-gray-400 leading-relaxed space-y-2">
                    <p>有些人生活在世界之中， 有些人，被世界对待。</p>
                    <p>世界地图看起来是一样的。 国界线、海岸线、颜色与名字。</p>
                    <p>
                      但对有些人来说， 这些线条，决定了他们是否会被当成罪犯，
                      是否会被当成病人， 是否被允许牵起另一个人的手。
                    </p>
                    <p>
                      这张地图，只做一件事： 把世界如何对待性少数群体，标出来。
                    </p>
                    <p className="text-gray-500">
                      不评判，不煽动。 只是让你看见。
                    </p>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Map */}
            <div className="lg:w-[65%] w-full flex justify-center items-center">
              <div className="w-full max-w-3xl">
                <WorldMap />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Content Section */}
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 px-6">
        <Card className="max-w-2xl w-full border-none shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">更多精彩内容</CardTitle>
            <CardDescription className="text-base mt-2">
              滚动查看导航栏效果
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />
            <p className="text-muted-foreground text-center">
              探索更多关于这个项目的信息和资源
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
