type PubSubEventMap<Payload = unknown> = Record<string, Payload>;

type PubSubListener<M extends PubSubEventMap, K extends keyof M = keyof M> = (
  payload: M[K],
) => Promise<void> | void;

export class PubSub<AvailableEventMap extends PubSubEventMap> {
  private subscribers = new Map<keyof AvailableEventMap, PubSubListener<AvailableEventMap>[]>();

  subscribe<T extends keyof AvailableEventMap>(
    event: T,
    subscriber: PubSubListener<AvailableEventMap, T>,
  ): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, []);
    }

    const alreadySubscribed = this.subscribers.get(event)?.find((sub) => sub === subscriber);

    if (!alreadySubscribed) {
      this.subscribers.get(event)?.push(subscriber as PubSubListener<AvailableEventMap>);
    }

    return () => {
      this.unsubscribe(event, subscriber);
    };
  }

  unsubscribe<T extends keyof AvailableEventMap>(
    event: T,
    subscriber: PubSubListener<AvailableEventMap, T>,
  ) {
    if (this.subscribers.has(event)) {
      const updatedPubSubListeners =
        this.subscribers.get(event)?.filter((sub) => sub !== subscriber) || [];
      if (updatedPubSubListeners.length > 0) {
        this.subscribers.set(event, updatedPubSubListeners);
      } else {
        this.subscribers.delete(event);
      }
    }
  }

  publish<T extends keyof AvailableEventMap>(event: T, payload: AvailableEventMap[T]) {
    if (this.subscribers.has(event)) {
      (this.subscribers.get(event) || []).forEach((subscriber) => {
        subscriber(payload);
      });
    }
  }
}
