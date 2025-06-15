import { EventEmitter } from './event-emitter';
import { Command, CommandInvoker, CommandData } from './command';
import { ComponentState, IdleState, HoveredState, FocusedState, PressedState, DisabledState, LoadingState, ErrorState } from './component-states';
import type { InteractionStrategy, InteractionPayload, InteractionResult } from './interaction-strategies';

export interface BaseComponentState {
    isDisabled?: boolean;
    isHovered?: boolean;
    isFocused?: boolean;
    isPressed?: boolean;
    isLoading?: boolean;
    error?: any | null;
}

export interface CssState {
    classes: string[];
    dataAttributes: Record<string, string>;
}

export abstract class HeadlessComponent<TState extends BaseComponentState> extends EventEmitter {
    protected state: TState;
    protected states: Map<string, ComponentState>;
    protected currentState: ComponentState | null;
    protected interactionStrategies: Map<string, InteractionStrategy>;
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
        // Initial state transition must be called after subclasses have potentially set up their specific states
        // This is often done by the subclass constructor or an init method.
        // For now, we'll call it here, assuming default states are sufficient for initial determination.
        this.updateCurrentStateBasedOnData(this.state); 
    }
    
    abstract defineInitialState(): TState;
    
    protected setupDefaultStates(): void {
        this.addState('idle', new IdleState('idle', this));
        this.addState('hovered', new HoveredState('hovered', this));
        this.addState('focused', new FocusedState('focused', this));
        this.addState('pressed', new PressedState('pressed', this));
        this.addState('disabled', new DisabledState('disabled', this));
        this.addState('loading', new LoadingState('loading', this));
        this.addState('error', new ErrorState('error', this));
    }
    
    protected setupDefaultStrategies(): void {
        // To be implemented by subclasses
    }
    
    addState(name: string, stateInstance: ComponentState): void {
        this.states.set(name, stateInstance);
    }
    
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
    
    setState(newState: Partial<TState>): boolean {
        const previousState = { ...this.state };
        const nextState = { ...this.state, ...newState };
        
        if (JSON.stringify(previousState) === JSON.stringify(nextState)) {
            return false; 
        }

        const command = new Command(
            () => {
                this.state = nextState;
                this.updateCurrentStateBasedOnData(this.state);
                this.notifyObservers('stateChanged', this.getState());
            },
            () => {
                this.state = previousState;
                this.updateCurrentStateBasedOnData(this.state);
                this.notifyObservers('stateChanged', this.getState());
            },
            { previousState, nextState } as CommandData
        );
        
        this.commandInvoker.execute(command);
        return true;
    }
    
    getState(): TState {
        return { ...this.state };
    }
    
    abstract updateCurrentStateBasedOnData(stateData: TState): void;
    
    getCSSState(): CssState {
        const baseClasses = ['headless-component'];
        const stateClasses = this.currentState ? this.currentState.getCSSClasses() : [];
        const dataAttributes = this.getDataAttributes();
        
        return {
            classes: [...baseClasses, ...stateClasses, this.constructor.name.toLowerCase().replace('headless', '')],
            dataAttributes: dataAttributes
        };
    }
    
    getDataAttributes(): Record<string, string> {
        return {};
    }
    
    handleInteraction(type: string, payload: InteractionPayload): InteractionResult {
        const strategy = this.interactionStrategies.get(type);
        if (strategy) {
            return strategy.handle(this, payload);
        }
        console.warn(`No interaction strategy found for type "${type}" on component ${this.constructor.name}`);
        return { prevented: false, handled: false };
    }
    
    undo(): boolean {
        const result = this.commandInvoker.undo();
        if (result) this.notifyObservers('historyChanged', this.getHistory());
        return result;
    }
    
    redo(): boolean {
        const result = this.commandInvoker.redo();
        if (result) this.notifyObservers('historyChanged', this.getHistory());
        return result;
    }
    
    getHistory() {
        return this.commandInvoker.getHistory();
    }
}
