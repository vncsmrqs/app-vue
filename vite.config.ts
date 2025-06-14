import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
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
    tailwindcss(),
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
      manifest: {
        theme_color: appConfig.themeColor,
        background_color: appConfig.startBackgroundColor,
        display: 'standalone',
        scope: '/',
        start_url: '/?utm_source=homescreen&utm_medium=shortcut',
        name: appConfig.name,
        short_name: appConfig.shortName,
        description: appConfig.description,
        screenshots: [
          // {
          //   src: '/screenshot-mobile-default.jpeg',
          //   sizes: '794x1600',
          //   type: 'image/jpeg',
          //   form_factor: 'narrow',
          // },
          // {
          //   src: '/screenshot-desktop-default.png',
          //   sizes: '3456x2234',
          //   type: 'image/png',
          //   form_factor: 'wide',
          // },
        ],
        shortcuts: [
          {
            name: 'Home',
            url: '/home/?utm_source=jumplist&utm_medium=shortcut',
            icons: [
              {
                src: 'logo-192x192.png',
                type: 'image/png',
                sizes: '192x192',
              },
            ],
          },
        ],
        icons: [
          {
            src: 'logo-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            src: 'logo-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            purpose: 'maskable',
            src: 'logo-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
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
