"use client";

import {
  DottedMap,
  geojsonWorld,
  useMapFactory,
} from "@suxiong/react-dotted-map";

export function WorldMap() {
  const map = useMapFactory({
    height: 400,
    width: 800,
    grid: "square",
    spacing: 2,
    geojsonWorld,
  });

  return (
    <DottedMap
      map={map}
      shape="circle"
      color="#3b82f6"
      backgroundColor="#f3f4f6"
      radius={1}
    />
  );
}
