import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // Allow Cloudflare quick-tunnel hostnames for the optional live preview.
    allowedHosts: ['.trycloudflare.com'],
  },
});
