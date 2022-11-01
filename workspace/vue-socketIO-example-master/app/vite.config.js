import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  erver: {
    proxy: {
      // Proxying websockets or socket.io
      // "/socket.io": {
      //   target: "ws://localhost:3000",
      //   ws: true,
      // },
    },
  },
});
