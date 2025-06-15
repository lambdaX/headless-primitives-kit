/**
 * Represents an action that can be executed and undone.
 * Commands are typically used to modify the state of a component
 * in a way that can be reversed, supporting undo/redo functionality.
 */
export class Command {
    /**
     * Creates a new Command instance.
     * @param execute The function that performs the command's action.
     * @param undo The function that reverts the command's action.
     * @param data Optional data associated with the command.
     */
    constructor(execute, undo, data = {}) {
        this.execute = execute;
        this.undo = undo;
        this.data = data;
        this.timestamp = Date.now();
    }
}
/**
 * Manages a history of commands, allowing for execution, undo, and redo operations.
 * This class is central to implementing undo/redo functionality in components.
 */
export class CommandInvoker {
    constructor() {
        this.history = [];
        this.currentPosition = -1;
    }
    /**
     * Executes a command and adds it to the history.
     * If commands were previously undone, executing a new command clears the "redo" history.
     * @param command The command to execute.
     */
    execute(command) {
        command.execute();
        // If we execute a new command after undoing some, clear the redo history
        this.history = this.history.slice(0, this.currentPosition + 1);
        this.history.push(command);
        this.currentPosition = this.history.length - 1;
    }
    /**
     * Undoes the last executed command if possible.
     * @returns True if a command was undone, false otherwise.
     */
    undo() {
        if (this.canUndo()) {
            this.history[this.currentPosition].undo();
            this.currentPosition--;
            return true;
        }
        return false;
    }
    /**
     * Redoes the last undone command if possible.
     * @returns True if a command was redone, false otherwise.
     */
    redo() {
        if (this.canRedo()) {
            this.currentPosition++;
            this.history[this.currentPosition].execute();
            return true;
        }
        return false;
    }
    /**
     * Checks if an undo operation can be performed.
     * @returns True if there are commands to undo, false otherwise.
     */
    canUndo() {
        return this.currentPosition >= 0;
    }
    /**
     * Checks if a redo operation can be performed.
     * @returns True if there are commands to redo, false otherwise.
     */
    canRedo() {
        return this.currentPosition < this.history.length - 1;
    }
    /**
     * Gets the current state of the command history.
     * @returns An object containing the history length, current position, and undo/redo capabilities.
     */
    getHistory() {
        return {
            length: this.history.length,
            currentPosition: this.currentPosition,
            canUndo: this.canUndo(),
            canRedo: this.canRedo()
        };
    }
}
//# sourceMappingURL=command.js.map