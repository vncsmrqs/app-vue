import 'workbox-precaching';
import { appConfig } from '@/config/app-config.ts';

declare let self: ServiceWorkerGlobalScope;

export type NotificationPayload = {
  type: 'NOTIFICATION';
  title: string;
  body: string;
  tag?: string;
  icon?: string;
  badge?: string;
  data?: {
    path: string;
  };
};

const notify = async (notification?: NotificationPayload) => {
  const permission = Notification.permission;

  if (notification?.type !== 'NOTIFICATION') {
    return;
  }

  if (permission === 'granted') {
    const notificationOptions: NotificationOptions = {
      body: notification.body, //ok
      data: notification.data || {},
      icon: notification.icon ?? 'logo.svg',
      badge: notification.badge ?? 'logo.svg',
      tag: notification.tag || crypto.randomUUID(),
    };

    await self.registration.showNotification(
      notification.title ?? appConfig.manifest.name,
      notificationOptions,
    );
  }
};

self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

  const data = event.data.json();

  if (data?.type === 'NOTIFICATION') {
    event.waitUntil(notify(data));
  }
});

self.addEventListener('message', async (event) => {
  if (!event.data) {
    return;
  }

  if (event.data?.type === 'NOTIFICATION') {
    event.waitUntil(notify(event.data));
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const path = event.notification.data?.path || '/app';

  event.waitUntil(handleClick(path));
});

async function handleClick(path: string) {
  const clientList = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true,
  });

  for (const client of clientList) {
    if ('focus' in client) {
      await client.focus();

      try {
        client.postMessage({
          type: 'NAVIGATE',
          path,
          ts: Date.now(),
        });
        return;
      } catch (_e) {
        client.navigate(path);
        return;
      }
    }
  }

  if (self.clients.openWindow) {
    return self.clients.openWindow(path);
  }
}
