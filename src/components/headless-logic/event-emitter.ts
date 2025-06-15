export type EventCallback = (event: string, data?: any) => void;

export class EventEmitter {
    private observers: Map<string, EventCallback[]>;

    constructor() {
        this.observers = new Map<string, EventCallback[]>();
    }
    
    subscribe(event: string, callback: EventCallback): () => void {
        if (!this.observers.has(event)) {
            this.observers.set(event, []);
        }
        this.observers.get(event)!.push(callback);
        
        // Return unsubscribe function
        return () => this.unsubscribe(event, callback);
    }
    
    unsubscribe(event: string, callback: EventCallback): void {
        if (this.observers.has(event)) {
            const callbacks = this.observers.get(event)!;
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    notifyObservers(event: string, data?: any): void {
        if (this.observers.has(event)) {
            this.observers.get(event)!.forEach(callback => {
                try {
                    callback(event, data);
                } catch (error) {
                    console.error(`Error in observer callback for event "${event}":`, error);
                }
            });
        }
    }
}
