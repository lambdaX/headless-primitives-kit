/// <reference types="react" />
import { HeadlessComponent, BaseComponentState } from './headless-component';
/**
 * Defines the state properties for a `HeadlessToggle` component (e.g., a switch).
 */
export interface ToggleState extends BaseComponentState {
    /** Whether the toggle is currently checked/on. */
    isChecked: boolean;
}
/**
 * Manages the state and interactions for a toggle component, such as a switch.
 * Toggles typically have two states: checked (on) and unchecked (off).
 */
export declare class HeadlessToggle extends HeadlessComponent<ToggleState> {
    /**
     * Defines the initial state for the toggle.
     * @returns The initial toggle state.
     */
    defineInitialState(): ToggleState;
    /**
     * Sets up default interaction strategies for the toggle.
     */
    protected setupDefaultStrategies(): void;
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the toggle.
     */
    updateCurrentStateBasedOnData(stateData: ToggleState): void;
    /**
     * Gets the data attributes for the toggle element.
     * @returns A record of data attributes including `data-checked`.
     */
    getDataAttributes(): Record<string, string>;
    /**
     * Toggles the checked state of the component.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the toggle interaction.
     */
    toggle(originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the toggle to its checked (on) state.
     * Does nothing if already checked or disabled.
     */
    check(): void;
    /**
     * Sets the toggle to its unchecked (off) state.
     * Does nothing if already unchecked or disabled.
     */
    uncheck(): void;
    /**
     * Sets the disabled state of the toggle.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean): void;
    /**
     * Sets the loading state of the toggle.
     * @param loading True to set to loading, false otherwise.
     */
    setLoading(loading: boolean): void;
    /**
     * Sets an error state for the toggle.
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null): void;
    /**
     * Handles hover interaction.
     * @param isHovered True if hovering, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the hover interaction.
     */
    hover(isHovered: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Handles focus interaction.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the pressed state (e.g., mousedown).
     * @param isPressed True if pressed, false otherwise.
     */
    press(isPressed: boolean): void;
    /**
     * Handles keyboard interaction (e.g., Space or Enter key).
     * @param originalEvent The KeyboardEvent.
     * @returns The result of the keyboard interaction.
     */
    keydown(originalEvent: KeyboardEvent): import("./interaction-strategies").InteractionResult;
}
//# sourceMappingURL=headless-toggle.d.ts.map