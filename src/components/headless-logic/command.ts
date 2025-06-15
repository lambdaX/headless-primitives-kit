export interface CommandData {
    [key: string]: any;
}

export class Command {
    public execute: () => void;
    public undo: () => void;
    public data: CommandData;
    public timestamp: number;

    constructor(execute: () => void, undo: () => void, data: CommandData = {}) {
        this.execute = execute;
        this.undo = undo;
        this.data = data;
        this.timestamp = Date.now();
    }
}

export class CommandInvoker {
    private history: Command[];
    private currentPosition: number;

    constructor() {
        this.history = [];
        this.currentPosition = -1;
    }
    
    execute(command: Command): void {
        command.execute();
        this.history = this.history.slice(0, this.currentPosition + 1);
        this.history.push(command);
        this.currentPosition = this.history.length - 1;
    }
    
    undo(): boolean {
        if (this.canUndo()) {
            this.history[this.currentPosition].undo();
            this.currentPosition--;
            return true;
        }
        return false;
    }
    
    redo(): boolean {
        if (this.canRedo()) {
            this.currentPosition++;
            this.history[this.currentPosition].execute();
            return true;
        }
        return false;
    }
    
    canUndo(): boolean {
        return this.currentPosition >= 0;
    }
    
    canRedo(): boolean {
        return this.currentPosition < this.history.length - 1;
    }
    
    getHistory(): { length: number; currentPosition: number; canUndo: boolean; canRedo: boolean } {
        return {
            length: this.history.length,
            currentPosition: this.currentPosition,
            canUndo: this.canUndo(),
            canRedo: this.canRedo()
        };
    }
}
