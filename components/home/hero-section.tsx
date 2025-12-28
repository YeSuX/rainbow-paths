import { Badge } from "@/components/ui/badge";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="flex items-center">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-16">
          {/* Left Column - Title and Description */}
          <div className="lg:w-[40%] w-full">
            <div className="space-y-4 sm:space-y-5">
              {/* Main Title - Notion style */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl font-bold text-[#37352F] leading-tight">
                全球 <span style={{ color: "var(--rainbow-red)" }}>L</span>
                <span style={{ color: "var(--rainbow-orange)" }}>G</span>
                <span style={{ color: "var(--rainbow-blue)" }}>B</span>
                <span style={{ color: "var(--rainbow-yellow)" }}>T</span>
                <span style={{ color: "var(--rainbow-green)" }}>Q</span>
                <span style={{ color: "var(--rainbow-purple)" }}>+</span>{" "}
                权益地图
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg md:text-xl text-[#787774] leading-relaxed">
                追踪各国去罪化、去病化与婚姻平权的法律进展
              </p>

              {/* Divider */}
              <div className="pt-2 pb-1">
                <div className="h-px bg-[#E3E2E0]" />
              </div>

              {/* Description */}
              <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#787774] leading-relaxed">
                <p>同一张世界地图，对不同的人意味着不同的现实。</p>
                <p>
                  这些线条决定了一些人能否自由生活，能否不被视为罪犯或病人，能否合法地牵起爱人的手。
                </p>
              </div>

              {/* Tags - Notion style */}
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="blue">🌍 Global Data</Badge>
                <Badge variant="green">🏳️‍🌈 Human Rights</Badge>
              </div>
            </div>
          </div>

          {/* Right Column - Picture */}
          <div className="lg:w-[60%] w-full">
            <div className="w-full max-w-4xl mx-auto">
              <Image
                className="rounded-md sm:rounded-lg border border-[#E3E2E0] shadow-notion-card"
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
