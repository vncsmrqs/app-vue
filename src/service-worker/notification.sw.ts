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

self.addEventListener(
  'notificationclick',
  (event: NotificationEvent) => {
    const importantPathList = ['/admin'];

    event.notification.close();

    if (event.action === 'archive') {
      // User selected the Archive routeAction.
      // archiveEmail();
    } else {
      // User selected (e.g., clicked in) the main body of notification.
      // clients.openWindow('/inbox');
    }

    event.waitUntil(
      self.clients
        .matchAll({
          type: 'window',
        })
        .then(async (clientList) => {
          if (event.notification.data?.path) {
            for (const client of clientList) {
              const clientUrl = new URL(client.url);

              const isImportantPath = importantPathList.some((path) =>
                clientUrl.pathname.startsWith(path),
              );

              if (
                (!isImportantPath || clientUrl.pathname === event.notification.data.path) &&
                'focus' in client
              ) {
                await client.focus();
                client.postMessage({ type: 'NAVIGATE', path: event.notification.data.path });
                return client.navigate(event.notification.data.path);
              }
            }

            if (self.clients.openWindow) {
              return self.clients.openWindow(event.notification.data?.path);
            }
          }

          if (self.clients.openWindow) {
            return self.clients.openWindow('/');
          }
        }),
    );
  },
  false,
);
