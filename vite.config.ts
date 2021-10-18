import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // treat all tags with a dash as custom elements
          isCustomElement: (tag) => tag.includes("-"),
        },
      },
    }),
    VitePWA({
      includeAssets: [
        "android-chrome-192x192.png",
        "android-chrome-256x256.png",
        "apple-touch-icon.png",
        "favicon-16x16.png",
        "favicon-32x32.png",
        "favicon.ico",
        "mstile-150x150.png",
        "safari-pinned-tab.svg",
        "crypto-wallet-widget.js",
        "crypto-wallet-widget.js.map",
      ],
      manifest: {
        name: "Kraken Staking Rewards",
        short_name: "Kraken Staking",
        description:
          "Calculator and tracker for staking rewards on the Kraken exchange.",
        theme_color: "#1c2435",
        background_color: "#1c2435",
        icons: [
          {
            src: "android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "android-chrome-256x256.png",
            sizes: "256x256",
            type: "image/png",
          },
        ],
        display: "standalone",
      },
    }),
  ],
});
