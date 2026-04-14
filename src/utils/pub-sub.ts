type PubSubEventMap<Payload = unknown> = Record<string, Payload>;

type PubSubListener<M extends PubSubEventMap, K extends keyof M = keyof M> = (
  payload: M[K],
) => Promise<void> | void;

type AnyListener<M extends PubSubEventMap> = PubSubListener<M, keyof M>;

export type PubSubSubscription = {
  unsubscribe: () => void;
  isActive: () => boolean;
};

/**
 * Enhanced PubSub com suporte a automatic cleanup e lifecycle management
 * Previne memory leaks usando WeakMap para tracking de subscribers
 */
export class PubSub<AvailableEventMap extends PubSubEventMap> {
  private subscribers = new Map<keyof AvailableEventMap, PubSubListener<AvailableEventMap>[]>();
  private activeSubscriptions = new WeakMap<
    PubSubListener<AvailableEventMap>,
    Set<keyof AvailableEventMap>
  >();
  private maxListenersPerEvent = 100;
  private listenerWarnings = new Map<keyof AvailableEventMap, boolean>();

  /**
   * Configura o máximo de listeners por evento para detecção de memory leaks
   */
  setMaxListeners(max: number): void {
    this.maxListenersPerEvent = max;
  }

  subscribe<T extends keyof AvailableEventMap>(
    event: T,
    subscriber: PubSubListener<AvailableEventMap, T>,
  ): PubSubSubscription {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
      this.listenerWarnings.set(event, false);
    }

    const listeners = this.subscribers.get(event)!;
    const alreadySubscribed = listeners.find((sub) => sub === subscriber);

    if (alreadySubscribed) {
      return this.createSubscription(event, subscriber);
    }

    // Detectar possível memory leak
    if (listeners.length >= this.maxListenersPerEvent) {
      if (!this.listenerWarnings.get(event)) {
        console.warn(
          `[PubSub] Possível memory leak detectado: ${String(event)} tem ${listeners.length} listeners`,
        );
        this.listenerWarnings.set(event, true);
      }
    }

    listeners.push(subscriber as PubSubListener<AvailableEventMap>);

    // Track subscription no WeakMap
    const listenerKey = subscriber as AnyListener<AvailableEventMap>;

    if (!this.activeSubscriptions.has(listenerKey)) {
      this.activeSubscriptions.set(listenerKey, new Set());
    }
    this.activeSubscriptions.get(listenerKey)!.add(event);

    return this.createSubscription(event, subscriber);
  }

  private createSubscription<T extends keyof AvailableEventMap>(
    event: T,
    subscriber: PubSubListener<AvailableEventMap, T>,
  ): PubSubSubscription {
    let isActive = true;

    return {
      unsubscribe: () => {
        if (!isActive) return;
        isActive = false;
        this.unsubscribe(event, subscriber);
      },
      isActive: () => isActive,
    };
  }

  unsubscribe<T extends keyof AvailableEventMap>(
    event: T,
    subscriber: PubSubListener<AvailableEventMap, T>,
  ): void {
    if (!this.subscribers.has(event)) {
      return;
    }

    const listeners = this.subscribers.get(event)!;
    const initialLength = listeners.length;
    const updatedListeners = listeners.filter((sub) => sub !== subscriber);

    if (updatedListeners.length !== initialLength) {
      if (updatedListeners.length > 0) {
        this.subscribers.set(event, updatedListeners);
      } else {
        this.subscribers.delete(event);
        this.listenerWarnings.delete(event);
      }

      // Cleanup do tracking
      const listenerKey = subscriber as AnyListener<AvailableEventMap>;
      const eventSet = this.activeSubscriptions.get(listenerKey);
      if (eventSet) {
        eventSet.delete(event);
        if (eventSet.size === 0) {
          this.activeSubscriptions.delete(listenerKey);
        }
      }
    }
  }

  /**
   * Unsubscribe de todos os eventos para um subscriber
   */
  unsubscribeAll<T extends PubSubListener<AvailableEventMap>>(subscriber: T): void {
    const events = this.activeSubscriptions.get(subscriber);

    if (!events) {
      return;
    }

    events.forEach((event) => {
      this.unsubscribe(event, subscriber as PubSubListener<AvailableEventMap>);
    });
  }

  publish<T extends keyof AvailableEventMap>(event: T, payload: AvailableEventMap[T]): void {
    if (!this.subscribers.has(event)) {
      return;
    }

    const listeners = this.subscribers.get(event) || [];
    listeners.forEach((subscriber) => {
      try {
        subscriber(payload);
      } catch (error) {
        console.error(`[PubSub] Erro ao executar listener para evento ${String(event)}:`, error);
      }
    });
  }

  /**
   * Limpar todos os subscribers (útil para cleanup ao destruir a aplicação)
   */
  clear(): void {
    this.subscribers.clear();
    this.listenerWarnings.clear();
  }

  /**
   * Obter informações de debug sobre subscribers
   */
  getDebugInfo(): Record<string, number> {
    const info: Record<string, number> = {};
    this.subscribers.forEach((listeners, event) => {
      info[String(event)] = listeners.length;
    });
    return info;
  }
}
