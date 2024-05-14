import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl({
      /** name of certification */
      name: "localhost",
      /** custom trust domains */
      /* domains: ["*.custom.com"], */
      /** custom certification directory */
      certDir: "/Users/creski/devServer/cert",
    }),
  ],
});
