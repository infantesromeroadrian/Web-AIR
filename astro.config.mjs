import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://infantesromeroadrian.github.io",
  base: "/Web-AIR",
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
