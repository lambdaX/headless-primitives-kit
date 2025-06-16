/**
 * Defines the shape of a callback function for handling events.
 * @param event The name of the event that occurred.
 * @param data Optional data associated with the event.
 */
export declare type EventCallback = (event: string, data?: any) => void;
/**
 * A simple event emitter class that allows objects to subscribe to events
 * and be notified when those events occur.
 */
export declare class EventEmitter {
    private observers;
    constructor();
    /**
     * Subscribes a callback function to a specific event.
     * @param event The name of the event to subscribe to.
     * @param callback The function to call when the event occurs.
     * @returns An unsubscribe function that can be called to remove the subscription.
     */
    subscribe(event: string, callback: EventCallback): () => void;
    /**
     * Unsubscribes a callback function from a specific event.
     * @param event The name of the event to unsubscribe from.
     * @param callback The callback function to remove.
     */
    unsubscribe(event: string, callback: EventCallback): void;
    /**
     * Notifies all subscribed observers of a particular event.
     * @param event The name of the event to notify observers about.
     * @param data Optional data to pass to the event callbacks.
     */
    notifyObservers(event: string, data?: any): void;
}
//# sourceMappingURL=event-emitter.d.ts.map