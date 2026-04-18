export const appConfig = {
  pwa: {
    autoUpdate: false,
    generateSW: false,
  },
  version: '0.0.31',
  manifest: {
    theme_color: '#FFFFFF',
    background_color: '#FFFFFF',
    display: 'standalone',
    scope: '/',
    start_url: '/app/?utm_source=homescreen&utm_medium=shortcut',
    name: 'App Name',
    short_name: 'App Short Name',
    description: 'Description',
    screenshots: [
      {
        src: '/screenshots/screenshot-1.png',
        sizes: '1290x2796',
        type: 'image/png',
        form_factor: 'narrow',
      },
    ],
    shortcuts: [
      {
        name: 'Home',
        url: '/app/home/?utm_source=jumplist&utm_medium=shortcut',
        icons: [
          {
            src: 'logo-192x192.png',
            type: 'image/png',
            sizes: '192x192',
          },
        ],
      },
      {
        name: 'Pedidos',
        url: '/app/orders/?utm_source=jumplist&utm_medium=shortcut',
        icons: [
          {
            src: 'logo-192x192.png',
            type: 'image/png',
            sizes: '192x192',
          },
        ],
      },
      {
        name: 'Conversas',
        url: '/app/chats/?utm_source=jumplist&utm_medium=shortcut',
        icons: [
          {
            src: 'logo-192x192.png',
            type: 'image/png',
            sizes: '192x192',
          },
        ],
      },
      {
        name: 'Notificações',
        url: '/app/notifications/?utm_source=jumplist&utm_medium=shortcut',
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
};

export const LOG_NAVIGATOR_ROUTER_NAVIGATION_EVENTS = false;
export const LOG_VIRTUAL_ROUTER_NAVIGATION_EVENTS = false;
