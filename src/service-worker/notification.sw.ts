import 'workbox-precaching';

declare let self: ServiceWorkerGlobalScope;

type NotificationType = {
  type: 'NOTIFICATION';
  title: string;
  body: string;
  tag: string;
  data: {
    path: string;
  };
};

const notify = async (notification?: NotificationType) => {
  const permission = Notification.permission;

  if (notification?.type !== 'NOTIFICATION') {
    return;
  }

  if (permission === 'granted') {
    const notificationOptions: NotificationOptions = {
      body: notification.body, //ok
      data: notification.data || {},
      icon: 'icon-logo-192x192.png',
      badge: 'icon-logo-192x192.png',
      tag: notification.tag || crypto.randomUUID(),
    };

    await self.registration.showNotification(notification.title ?? 'Realtime', notificationOptions);
  }
};

self.addEventListener('push', (event: PushEvent) => {
  if (!event.data) {
    return;
  }
  const data = event.data.json();
  event.waitUntil(notify(data));
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
