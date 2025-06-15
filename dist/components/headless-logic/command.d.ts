/**
 * Represents arbitrary data associated with a command.
 */
export interface CommandData {
    [key: string]: any;
}
/**
 * Represents an action that can be executed and undone.
 * Commands are typically used to modify the state of a component
 * in a way that can be reversed, supporting undo/redo functionality.
 */
export declare class Command {
    /** The function to execute the command's action. */
    execute: () => void;
    /** The function to undo the command's action. */
    undo: () => void;
    /** Arbitrary data associated with the command, e.g., previous and next state. */
    data: CommandData;
    /** Timestamp of when the command was created. */
    timestamp: number;
    /**
     * Creates a new Command instance.
     * @param execute The function that performs the command's action.
     * @param undo The function that reverts the command's action.
     * @param data Optional data associated with the command.
     */
    constructor(execute: () => void, undo: () => void, data?: CommandData);
}
/**
 * Defines the shape of the object returned by `getHistory()`.
 */
export interface CommandHistoryState {
    length: number;
    currentPosition: number;
    canUndo: boolean;
    canRedo: boolean;
}
/**
 * Manages a history of commands, allowing for execution, undo, and redo operations.
 * This class is central to implementing undo/redo functionality in components.
 */
export declare class CommandInvoker {
    private history;
    private currentPosition;
    constructor();
    /**
     * Executes a command and adds it to the history.
     * If commands were previously undone, executing a new command clears the "redo" history.
     * @param command The command to execute.
     */
    execute(command: Command): void;
    /**
     * Undoes the last executed command if possible.
     * @returns True if a command was undone, false otherwise.
     */
    undo(): boolean;
    /**
     * Redoes the last undone command if possible.
     * @returns True if a command was redone, false otherwise.
     */
    redo(): boolean;
    /**
     * Checks if an undo operation can be performed.
     * @returns True if there are commands to undo, false otherwise.
     */
    canUndo(): boolean;
    /**
     * Checks if a redo operation can be performed.
     * @returns True if there are commands to redo, false otherwise.
     */
    canRedo(): boolean;
    /**
     * Gets the current state of the command history.
     * @returns An object containing the history length, current position, and undo/redo capabilities.
     */
    getHistory(): CommandHistoryState;
}
//# sourceMappingURL=command.d.ts.map