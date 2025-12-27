import { HeroSection } from "@/components/home/hero-section";
import { MapSection } from "@/components/home/map-section";
import { TimelineSection } from "@/components/home/timeline-section";
import { DataSection } from "@/components/home/data-section";
import { StatsSection } from "@/components/home/stats-section";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
      <MapSection />
      <TimelineSection />
      <StatsSection />
      <DataSection />
    </div>
  );
}
