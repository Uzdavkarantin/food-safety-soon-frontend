import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oziq-ovqat mahsulotlari xavfsizligi qo'mitasi",
    short_name: "ai.food-safety.uz",
    start_url: "/uz",
    display: "standalone",
    background_color: "#F2F7FD",
    theme_color: "#1F56C4",
    icons: [{ src: "/logo.jpg", sizes: "640x640", type: "image/jpeg" }],
  };
}
