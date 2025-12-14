"use client";

import { useEffect, useRef, useState } from "react";
import {
  DottedMap,
  geojsonWorld,
  useMapFactory,
} from "@suxiong/react-dotted-map";

export function WorldMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = width / 2; // maintain 2:1 aspect ratio
        setDimensions({ width, height });
      }
    };

    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  const map = useMapFactory({
    height: dimensions.height,
    width: dimensions.width,
    grid: "diagonal",
    spacing: 5,
    geojsonWorld,
  });

  return (
    <div ref={containerRef} className="w-full">
      <DottedMap map={map} shape="circle" color="#A1A1B5" radius={1} />
    </div>
  );
}
