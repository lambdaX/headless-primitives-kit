import { EventEmitter } from './event-emitter';
import { Command, CommandInvoker } from './command';
import { IdleState, HoveredState, FocusedState, PressedState, DisabledState, LoadingState, ErrorState } from './component-states';
/**
 * Abstract base class for all headless UI components.
 * It provides core functionality for state management, event emission,
 * command handling (undo/redo), state transitions, and interaction strategy delegation.
 * @template TState The type of the component's specific state, extending `BaseComponentState`.
 */
export class HeadlessComponent extends EventEmitter {
    constructor() {
        super();
        this.state = this.defineInitialState();
        this.states = new Map();
        this.currentState = null;
        this.interactionStrategies = new Map();
        this.commandInvoker = new CommandInvoker();
        this.setupDefaultStates();
        this.setupDefaultStrategies();
        // Initial visual state transition based on the initial data state.
        this.updateCurrentStateBasedOnData(this.state);
    }
    /**
     * Sets up the default visual/interaction states for the component (e.g., Idle, Hovered).
     * Subclasses can override or extend this to add custom states.
     */
    setupDefaultStates() {
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
    setupDefaultStrategies() {
        // To be implemented by subclasses if they have default strategies.
    }
    /**
     * Adds a visual/interaction state to the component.
     * @param name The name of the state (e.g., "customState").
     * @param stateInstance An instance of `ComponentState` or its subclass.
     */
    addState(name, stateInstance) {
        this.states.set(name, stateInstance);
    }
    /**
     * Transitions the component to a new visual/interaction state.
     * This involves exiting the current state and entering the new one.
     * Notifies observers about the state transition and CSS state change.
     * @param stateName The name of the state to transition to.
     */
    transitionToState(stateName) {
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
            state: this.getState()
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
    setState(newState) {
        const previousState = Object.assign({}, this.state);
        const nextState = Object.assign(Object.assign({}, this.state), newState);
        if (JSON.stringify(previousState) === JSON.stringify(nextState)) {
            return false;
        }
        const command = new Command(() => {
            this.state = nextState;
            this.updateCurrentStateBasedOnData(this.state);
            this.notifyObservers('stateChanged', this.getState());
        }, () => {
            this.state = previousState;
            this.updateCurrentStateBasedOnData(this.state);
            this.notifyObservers('stateChanged', this.getState());
        }, { previousState, nextState });
        this.commandInvoker.execute(command);
        return true;
    }
    /**
     * Gets a copy of the current data state of the component.
     * @returns The current state object.
     */
    getState() {
        return Object.assign({}, this.state);
    }
    /**
     * Gets the current CSS-related state of the component.
     * This includes a list of CSS classes and data attributes based on the current visual state.
     * @returns A `CssState` object.
     */
    getCSSState() {
        const baseClasses = ['headless-component'];
        const stateClasses = this.currentState ? this.currentState.getCSSClasses() : [];
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
    getDataAttributes() {
        return Object.assign({ 'data-disabled': String(!!this.state.isDisabled), 'data-loading': String(!!this.state.isLoading) }, (this.state.error && { 'data-error': 'true' }));
    }
    /**
     * Handles an interaction by delegating to the appropriate registered strategy.
     * @param type The type of interaction (e.g., "click", "hover").
     * @param payload Data associated with the interaction.
     * @returns The result of the interaction, as returned by the strategy.
     */
    handleInteraction(type, payload) {
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
    undo() {
        const result = this.commandInvoker.undo();
        if (result)
            this.notifyObservers('historyChanged', this.getHistory());
        return result;
    }
    /**
     * Redoes the last undone command via the `CommandInvoker`.
     * Notifies observers about the history change.
     * @returns True if a command was redone, false otherwise.
     */
    redo() {
        const result = this.commandInvoker.redo();
        if (result)
            this.notifyObservers('historyChanged', this.getHistory());
        return result;
    }
    /**
     * Gets the current state of the command history from the `CommandInvoker`.
     * @returns An object describing the command history.
     */
    getHistory() {
        return this.commandInvoker.getHistory();
    }
}
//# sourceMappingURL=headless-component.js.map