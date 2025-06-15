
import { EventEmitter } from './event-emitter';
import { Command, CommandInvoker, type CommandData, type CommandHistoryState } from './command';
import { ComponentState, IdleState, HoveredState, FocusedState, PressedState, DisabledState, LoadingState, ErrorState } from './component-states';
import type { InteractionStrategy, InteractionPayload, InteractionResult } from './interaction-strategies';

/**
 * Base interface for the state object of any headless component.
 * Components can extend this to add their specific state properties.
 */
export interface BaseComponentState {
    /** Whether the component is disabled and cannot be interacted with. */
    isDisabled?: boolean;
    /** Whether the component is currently being hovered over by a pointer. */
    isHovered?: boolean;
    /** Whether the component currently has focus. */
    isFocused?: boolean;
    /** Whether the component is currently being pressed (e.g., mouse button down). */
    isPressed?: boolean;
    /** Whether the component is in a loading or busy state. */
    isLoading?: boolean;
    /** An error associated with the component, if any. */
    error?: any | null;
}

/**
 * Represents the CSS-related state of a component, including class names and data attributes.
 */
export interface CssState {
    /** An array of CSS class names to apply to the component. */
    classes: string[];
    /** A record of data attributes (e.g., `data-disabled="true"`) to apply to the component. */
    dataAttributes: Record<string, string>;
}

/**
 * Abstract base class for all headless UI components.
 * It provides core functionality for state management, event emission,
 * command handling (undo/redo), state transitions, and interaction strategy delegation.
 * @template TState The type of the component's specific state, extending `BaseComponentState`.
 */
export abstract class HeadlessComponent<TState extends BaseComponentState> extends EventEmitter {
    /** The current data state of the component. */
    protected state: TState;
    /** A map of named `ComponentState` instances (e.g., "idle", "hovered"). */
    protected states: Map<string, ComponentState>;
    /** The current visual/interaction state instance (e.g., an instance of `IdleState`). */
    protected currentState: ComponentState | null;
    /** A map of interaction strategies keyed by interaction type (e.g., "click", "hover"). */
    protected interactionStrategies: Map<string, InteractionStrategy>;
    /** The command invoker instance for managing undo/redo operations. */
    public commandInvoker: CommandInvoker;
    
    constructor() {
        super();
        this.state = this.defineInitialState();
        this.states = new Map<string, ComponentState>();
        this.currentState = null;
        this.interactionStrategies = new Map<string, InteractionStrategy>();
        this.commandInvoker = new CommandInvoker();
        
        this.setupDefaultStates();
        this.setupDefaultStrategies();
        // Initial visual state transition based on the initial data state.
        this.updateCurrentStateBasedOnData(this.state); 
    }
    
    /**
     * Abstract method to be implemented by subclasses to define their initial data state.
     * @returns The initial state object for the component.
     */
    abstract defineInitialState(): TState;
    
    /**
     * Sets up the default visual/interaction states for the component (e.g., Idle, Hovered).
     * Subclasses can override or extend this to add custom states.
     */
    protected setupDefaultStates(): void {
        this.addState('idle', new IdleState('idle', this));
        this.addState('hovered', new HoveredState('hovered', this));
        this.addState('focused', new FocusedState('focused', this));
        this.addState('pressed', new PressedState('pressed', this));
        this.addState('disabled', new DisabledState('disabled', this));
        this.addState('loading', new LoadingState('loading', this));
        this.addState('error', new ErrorState('error', this));
    }
    
    /**
     * Placeholder for subclasses to set up their default interaction strategies.
     */
    protected setupDefaultStrategies(): void {
        // To be implemented by subclasses if they have default strategies.
    }
    
    /**
     * Adds a visual/interaction state to the component.
     * @param name The name of the state (e.g., "customState").
     * @param stateInstance An instance of `ComponentState` or its subclass.
     */
    addState(name: string, stateInstance: ComponentState): void {
        this.states.set(name, stateInstance);
    }
    
    /**
     * Transitions the component to a new visual/interaction state.
     * This involves exiting the current state and entering the new one.
     * Notifies observers about the state transition and CSS state change.
     * @param stateName The name of the state to transition to.
     */
    transitionToState(stateName: string): void {
        const newStateInstance = this.states.get(stateName);
        if (!newStateInstance) {
            console.warn(`State "${stateName}" not found for component ${this.constructor.name}. Available states: ${Array.from(this.states.keys()).join(', ')}`);
            return;
        }
        
        if (this.currentState === newStateInstance) {
            return; // Already in this state
        }

        if (this.currentState) {
            this.currentState.exit();
        }
        
        this.currentState = newStateInstance;
        this.currentState.enter();
        
        this.notifyObservers('stateTransition', {
            stateName: stateName,
            state: this.getState() // Pass current data state
        });
        
        this.notifyObservers('cssStateChanged', this.getCSSState());
    }
    
    /**
     * Updates the component's data state.
     * This method creates a command for the change, allowing it to be undone/redone.
     * Notifies observers about the state change.
     * @param newState A partial state object containing the properties to update.
     * @returns True if the state was changed, false if the new state was identical to the current state.
     */
    setState(newState: Partial<TState>): boolean {
        const previousState = { ...this.state };
        const nextState = { ...this.state, ...newState };
        
        // Avoid unnecessary updates if the state hasn't actually changed.
        if (JSON.stringify(previousState) === JSON.stringify(nextState)) {
            return false; 
        }

        const command = new Command(
            () => { // Execute action
                this.state = nextState;
                this.updateCurrentStateBasedOnData(this.state); // Reflect data change in visual state
                this.notifyObservers('stateChanged', this.getState());
            },
            () => { // Undo action
                this.state = previousState;
                this.updateCurrentStateBasedOnData(this.state); // Reflect data change in visual state
                this.notifyObservers('stateChanged', this.getState());
            },
            { previousState, nextState } as CommandData // Data for the command
        );
        
        this.commandInvoker.execute(command);
        return true;
    }
    
    /**
     * Gets a copy of the current data state of the component.
     * @returns The current state object.
     */
    getState(): TState {
        return { ...this.state };
    }
    
    /**
     * Abstract method for subclasses to implement.
     * This method is responsible for determining the component's visual/interaction state
     * (by calling `transitionToState`) based on its current data state (`stateData`).
     * @param stateData The current data state of the component.
     */
    abstract updateCurrentStateBasedOnData(stateData: TState): void;
    
    /**
     * Gets the current CSS-related state of the component.
     * This includes a list of CSS classes and data attributes based on the current visual state.
     * @returns A `CssState` object.
     */
    getCSSState(): CssState {
        const baseClasses = ['headless-component'];
        const stateClasses = this.currentState ? this.currentState.getCSSClasses() : [];
        // Add component-specific class, e.g., "button" from "HeadlessButton"
        const componentTypeClass = this.constructor.name.toLowerCase().replace('headless', '');
        
        const dataAttributes = this.getDataAttributes();
        
        return {
            classes: [...baseClasses, ...stateClasses, componentTypeClass],
            dataAttributes: dataAttributes
        };
    }
    
    /**
     * Gets the data attributes for the component, reflecting its current data state.
     * Subclasses should override this to provide specific attributes.
     * @returns A record of data attributes.
     */
    getDataAttributes(): Record<string, string> {
        // Base implementation, typically overridden by subclasses.
        return {
            'data-disabled': String(!!this.state.isDisabled),
            'data-loading': String(!!this.state.isLoading),
            ...(this.state.error && { 'data-error': 'true' }),
        };
    }
    
    /**
     * Handles an interaction by delegating to the appropriate registered strategy.
     * @param type The type of interaction (e.g., "click", "hover").
     * @param payload Data associated with the interaction.
     * @returns The result of the interaction, as returned by the strategy.
     */
    handleInteraction(type: string, payload: InteractionPayload): InteractionResult {
        const strategy = this.interactionStrategies.get(type);
        if (strategy) {
            return strategy.handle(this, payload);
        }
        console.warn(`No interaction strategy found for type "${type}" on component ${this.constructor.name}`);
        return { prevented: false, handled: false, reason: 'No strategy' };
    }
    
    /**
     * Undoes the last command executed via the `CommandInvoker`.
     * Notifies observers about the history change.
     * @returns True if a command was undone, false otherwise.
     */
    undo(): boolean {
        const result = this.commandInvoker.undo();
        if (result) this.notifyObservers('historyChanged', this.getHistory());
        return result;
    }
    
    /**
     * Redoes the last undone command via the `CommandInvoker`.
     * Notifies observers about the history change.
     * @returns True if a command was redone, false otherwise.
     */
    redo(): boolean {
        const result = this.commandInvoker.redo();
        if (result) this.notifyObservers('historyChanged', this.getHistory());
        return result;
    }
    
    /**
     * Gets the current state of the command history from the `CommandInvoker`.
     * @returns An object describing the command history.
     */
    getHistory(): CommandHistoryState {
        return this.commandInvoker.getHistory();
    }

    /**
     * Notifies all subscribed observers of a particular event.
     * This method is inherited from EventEmitter and re-declared here to ensure
     * it's explicitly part of HeadlessComponent's type surface for subclasses,
     * which can help with type resolution in some build environments.
     * @param event The name of the event to notify observers about.
     * @param data Optional data to pass to the event callbacks.
     */
    public notifyObservers(event: string, data?: any): void {
        super.notifyObservers(event, data);
    }
}

