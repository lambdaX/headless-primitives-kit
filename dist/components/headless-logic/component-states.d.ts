import type { HeadlessComponent } from './headless-component';
/**
 * Represents a specific state a `HeadlessComponent` can be in (e.g., Idle, Hovered, Disabled).
 * Each state can define behavior for when the component enters or exits this state,
 * and contribute to the component's CSS class list.
 */
export declare class ComponentState {
    /** The name of the state (e.g., "idle", "hovered"). */
    name: string;
    /** The component instance this state belongs to. */
    component: HeadlessComponent<any>;
    /**
     * Creates a new ComponentState.
     * @param name The name of the state.
     * @param component The `HeadlessComponent` this state is associated with.
     */
    constructor(name: string, component: HeadlessComponent<any>);
    /**
     * Called when the component transitions into this state.
     * Subclasses can override this to implement state-specific entry logic.
     */
    enter(): void;
    /**
     * Called when the component transitions out of this state.
     * Subclasses can override this to implement state-specific exit logic.
     */
    exit(): void;
    /**
     * Gets the CSS class names associated with this state.
     * By default, returns an array containing the state's name.
     * @returns An array of CSS class strings.
     */
    getCSSClasses(): string[];
}
/** Represents the default, inactive state of a component. */
export declare class IdleState extends ComponentState {
    getCSSClasses(): string[];
}
/** Represents the state when a component is being hovered over by a pointer. */
export declare class HoveredState extends ComponentState {
    getCSSClasses(): string[];
}
/** Represents the state when a component has received focus. */
export declare class FocusedState extends ComponentState {
    getCSSClasses(): string[];
}
/** Represents the state when a component is actively being pressed (e.g., mouse button down). */
export declare class PressedState extends ComponentState {
    getCSSClasses(): string[];
}
/** Represents the state when a component is disabled and cannot be interacted with. */
export declare class DisabledState extends ComponentState {
    getCSSClasses(): string[];
}
/** Represents the state when a component is in a loading or busy state. */
export declare class LoadingState extends ComponentState {
    getCSSClasses(): string[];
}
/** Represents the state when a component has encountered an error. */
export declare class ErrorState extends ComponentState {
    getCSSClasses(): string[];
}
//# sourceMappingURL=component-states.d.ts.map