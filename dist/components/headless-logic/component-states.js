"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorState = exports.LoadingState = exports.DisabledState = exports.PressedState = exports.FocusedState = exports.HoveredState = exports.IdleState = exports.ComponentState = void 0;
/**
 * Represents a specific state a `HeadlessComponent` can be in (e.g., Idle, Hovered, Disabled).
 * Each state can define behavior for when the component enters or exits this state,
 * and contribute to the component's CSS class list.
 */
class ComponentState {
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
exports.ComponentState = ComponentState;
/** Represents the default, inactive state of a component. */
class IdleState extends ComponentState {
    getCSSClasses() { return ['idle']; }
}
exports.IdleState = IdleState;
/** Represents the state when a component is being hovered over by a pointer. */
class HoveredState extends ComponentState {
    getCSSClasses() { return ['hovered']; }
}
exports.HoveredState = HoveredState;
/** Represents the state when a component has received focus. */
class FocusedState extends ComponentState {
    getCSSClasses() { return ['focused']; }
}
exports.FocusedState = FocusedState;
/** Represents the state when a component is actively being pressed (e.g., mouse button down). */
class PressedState extends ComponentState {
    getCSSClasses() { return ['pressed']; }
}
exports.PressedState = PressedState;
/** Represents the state when a component is disabled and cannot be interacted with. */
class DisabledState extends ComponentState {
    getCSSClasses() { return ['disabled']; }
}
exports.DisabledState = DisabledState;
/** Represents the state when a component is in a loading or busy state. */
class LoadingState extends ComponentState {
    getCSSClasses() { return ['loading']; }
}
exports.LoadingState = LoadingState;
/** Represents the state when a component has encountered an error. */
class ErrorState extends ComponentState {
    getCSSClasses() { return ['error']; }
}
exports.ErrorState = ErrorState;
//# sourceMappingURL=component-states.js.map