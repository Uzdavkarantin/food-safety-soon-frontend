import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oziq-ovqat mahsulotlari xavfsizligi qo'mitasi",
    short_name: "food-safety.uz",
    start_url: "/uz",
    display: "standalone",
    background_color: "#f7faf9",
    theme_color: "#0f766e",
    icons: [{ src: "/logo.jpg", sizes: "512x512", type: "image/jpeg" }],
  };
}
