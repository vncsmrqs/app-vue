import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
// import vueDevTools from 'vite-plugin-vue-devtools';
import { ManifestOptions, VitePWA } from 'vite-plugin-pwa';
import { appConfig } from './src/config/app-config';

const globPatterns = ['**/*.{js,style,html,ico,png,svg,json,vue,txt,ttf,woff,woff2,css,jpg}'];

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 80,
    open: false,
    strictPort: true,
  },
  preview: {
    port: 80,
    strictPort: true,
  },
  plugins: [
    vue({}),
    // vueDevTools(),
    // tailwindcss(),
    VitePWA({
      registerType: appConfig.pwa.autoUpdate ? 'autoUpdate' : 'prompt',
      injectRegister: 'auto',
      strategies: appConfig.pwa.generateSW ? 'generateSW' : 'injectManifest',
      srcDir: appConfig.pwa.generateSW ? undefined : 'src/service-worker',
      filename: appConfig.pwa.generateSW ? undefined : 'sw.ts',
      injectManifest: {
        globPatterns,
        minify: false,
        sourcemap: true,
        enableWorkboxModulesLogs: true,
        swDest: 'dist/sw.js',
        swSrc: 'src/service-worker/sw.ts',
        // injectionPoint: undefined,
      },
      workbox: {
        globPatterns,
      },
      manifest: appConfig.manifest as Partial<ManifestOptions>,
      devOptions: {
        enabled: true,
        type: 'module',
      },
      // selfDestroying: true,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
