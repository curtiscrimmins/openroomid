import type { MetadataRoute } from "next";

const BASE = "https://openroomid.org";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${BASE}/` },
    { url: `${BASE}/spec/1.0` },
    { url: `${BASE}/paper` },
    { url: `${BASE}/brand` },
    { url: `${BASE}/registry` },
    { url: `${BASE}/implement` },
    { url: `${BASE}/volunteer` },
    { url: `${BASE}/changelog` },
  ];
}
