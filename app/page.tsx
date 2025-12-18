import { HeroSection } from "@/components/home/hero-section";
import { MapSection } from "@/components/home/map-section";
import { DataSection } from "@/components/home/data-section";

export default function Home() {
  return (
    <div className="pt-16">
      <HeroSection />
      <MapSection />
      <DataSection />
    </div>
  );
}
