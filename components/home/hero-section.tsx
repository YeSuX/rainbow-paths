import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function HeroSection() {
  return (
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

          {/* Right Column - Picture */}
          <div className="lg:w-[60%] w-full">
            <div className="w-full max-w-4xl mx-auto">
              <Image
                className="rounded-xl"
                src="https://plus.unsplash.com/premium_vector-1689096753612-274b36569156?q=80&w=3054&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Picture"
                width={800}
                height={400}
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

