import type { NotificationPayload } from '@/service-worker/notification.sw.ts';

const DEFAULT_ICON = 'logo.svg';
const DEFAULT_BADGE = 'logo.svg';

/**
 * Garante que o Service Worker está pronto
 */
export async function getSWController() {
  const registration = await navigator.serviceWorker.ready;

  return (
    navigator.serviceWorker.controller ||
    registration.active ||
    registration.waiting ||
    registration.installing
  );
}

/**
 * Envia mensagem genérica pro SW
 */
export async function sendToSW<T = unknown>(data: T) {
  const sw = await getSWController();

  if (!sw) {
    console.warn('Service Worker não disponível');
    return;
  }

  sw.postMessage(data);
}

/**
 * Dispara notificação via Service Worker
 */
export async function notifySW(payload: Omit<NotificationPayload, 'type'>) {
  const permission = await Notification.requestPermission();

  if (permission !== 'granted') {
    console.warn('Permissão de notificação negada');
    return;
  }

  return sendToSW({
    type: 'NOTIFICATION',
    title: payload.title,
    body: payload.body,
    tag: payload.tag ?? crypto.randomUUID(),
    icon: payload.icon ?? DEFAULT_ICON,
    badge: payload.badge ?? DEFAULT_BADGE,
    data: payload.data,
  });
}

/**
 * Força update do Service Worker
 */
export async function updateSW() {
  const registration = await navigator.serviceWorker.ready;

  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
}

/**
 * Escuta mensagens vindas do SW
 */
export function onSWMessage(callback: (data: unknown) => void) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    callback(event.data);
  });
}
