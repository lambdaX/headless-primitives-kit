/**
 * Represents a specific state a `HeadlessComponent` can be in (e.g., Idle, Hovered, Disabled).
 * Each state can define behavior for when the component enters or exits this state,
 * and contribute to the component's CSS class list.
 */
export class ComponentState {
    /**
     * Creates a new ComponentState.
     * @param name The name of the state.
     * @param component The `HeadlessComponent` this state is associated with.
     */
    constructor(name, component) {
        this.name = name;
        this.component = component;
    }
    /**
     * Called when the component transitions into this state.
     * Subclasses can override this to implement state-specific entry logic.
     */
    enter() {
        // Override in subclasses for state entry logic
    }
    /**
     * Called when the component transitions out of this state.
     * Subclasses can override this to implement state-specific exit logic.
     */
    exit() {
        // Override in subclasses for state exit logic
    }
    /**
     * Gets the CSS class names associated with this state.
     * By default, returns an array containing the state's name.
     * @returns An array of CSS class strings.
     */
    getCSSClasses() {
        return [this.name];
    }
}
/** Represents the default, inactive state of a component. */
export class IdleState extends ComponentState {
    getCSSClasses() { return ['idle']; }
}
/** Represents the state when a component is being hovered over by a pointer. */
export class HoveredState extends ComponentState {
    getCSSClasses() { return ['hovered']; }
}
/** Represents the state when a component has received focus. */
export class FocusedState extends ComponentState {
    getCSSClasses() { return ['focused']; }
}
/** Represents the state when a component is actively being pressed (e.g., mouse button down). */
export class PressedState extends ComponentState {
    getCSSClasses() { return ['pressed']; }
}
/** Represents the state when a component is disabled and cannot be interacted with. */
export class DisabledState extends ComponentState {
    getCSSClasses() { return ['disabled']; }
}
/** Represents the state when a component is in a loading or busy state. */
export class LoadingState extends ComponentState {
    getCSSClasses() { return ['loading']; }
}
/** Represents the state when a component has encountered an error. */
export class ErrorState extends ComponentState {
    getCSSClasses() { return ['error']; }
}
//# sourceMappingURL=component-states.js.map