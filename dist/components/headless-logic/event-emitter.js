/**
 * A simple event emitter class that allows objects to subscribe to events
 * and be notified when those events occur.
 */
export class EventEmitter {
    constructor() {
        this.observers = new Map();
    }
    /**
     * Subscribes a callback function to a specific event.
     * @param event The name of the event to subscribe to.
     * @param callback The function to call when the event occurs.
     * @returns An unsubscribe function that can be called to remove the subscription.
     */
    subscribe(event, callback) {
        if (!this.observers.has(event)) {
            this.observers.set(event, []);
        }
        this.observers.get(event).push(callback);
        // Return unsubscribe function
        return () => this.unsubscribe(event, callback);
    }
    /**
     * Unsubscribes a callback function from a specific event.
     * @param event The name of the event to unsubscribe from.
     * @param callback The callback function to remove.
     */
    unsubscribe(event, callback) {
        if (this.observers.has(event)) {
            const callbacks = this.observers.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    /**
     * Notifies all subscribed observers of a particular event.
     * @param event The name of the event to notify observers about.
     * @param data Optional data to pass to the event callbacks.
     */
    notifyObservers(event, data) {
        if (this.observers.has(event)) {
            // Iterate over a copy in case a callback unsubscribes itself or others
            [...(this.observers.get(event))].forEach(callback => {
                try {
                    callback(event, data);
                }
                catch (error) {
                    console.error(`Error in observer callback for event "${event}":`, error);
                }
            });
        }
    }
}
//# sourceMappingURL=event-emitter.js.map