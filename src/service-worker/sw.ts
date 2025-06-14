/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import type { ManifestEntry } from 'workbox-build';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import './notification.sw.ts';
import { appConfig } from '@/config/app-config.ts';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

const manifest = self.__WB_MANIFEST as Array<ManifestEntry>;

cleanupOutdatedCaches();

precacheAndRoute(manifest);

self.addEventListener('activate', () => {
  registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), { denylist: [] }));
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

if (appConfig.pwa.autoUpdate) {
  self.skipWaiting();
  clientsClaim();
}
