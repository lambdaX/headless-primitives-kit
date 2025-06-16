import { HeadlessComponent, BaseComponentState } from './headless-component';
/**
 * Defines the state properties for a `HeadlessCheckbox` component.
 */
export interface CheckboxState extends BaseComponentState {
    /** Whether the checkbox is currently checked. */
    isChecked: boolean;
    /** Whether the checkbox is in an indeterminate state. */
    isIndeterminate: boolean;
}
/**
 * Manages the state and interactions for a checkbox component.
 * Checkboxes can be checked, unchecked, or indeterminate.
 */
export declare class HeadlessCheckbox extends HeadlessComponent<CheckboxState> {
    /**
     * Defines the initial state for the checkbox.
     * @returns The initial checkbox state.
     */
    defineInitialState(): CheckboxState;
    /**
     * Sets up default interaction strategies for the checkbox.
     * Uses ToggleClickStrategy for its primary action.
     */
    protected setupDefaultStrategies(): void;
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the checkbox.
     */
    updateCurrentStateBasedOnData(stateData: CheckboxState): void;
    /**
     * Gets the data attributes for the checkbox element.
     * @returns A record of data attributes including `data-checked`, `data-indeterminate`.
     */
    getDataAttributes(): Record<string, string>;
    /**
     * Explicitly define notifyObservers to aid type resolution, calling the superclass implementation.
     */
    notifyObservers(event: string, data?: any): void;
    /**
     * Toggles the checkbox state.
     * If indeterminate, it becomes checked. Otherwise, it toggles between checked and unchecked.
     * @param originalEvent Optional. The original browser or React event.
     */
    toggle(originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the checkbox state to checked and clears indeterminate state.
     */
    check(): void;
    /**
     * Sets the checkbox state to unchecked and clears indeterminate state.
     */
    uncheck(): void;
    /**
     * Sets the indeterminate state of the checkbox.
     * When a checkbox is set to indeterminate, `isChecked` is typically set to `false`
     * as per common UI conventions, though the visual representation is distinct.
     * @param indeterminate True to set to indeterminate, false to clear.
     */
    setIndeterminate(indeterminate: boolean): void;
    /**
     * Sets the disabled state of the checkbox.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean): void;
    /**
     * Sets an error state for the checkbox.
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null): void;
    /**
     * Handles hover interaction.
     * @param isHovered True if hovering, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     */
    hover(isHovered: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Handles focus interaction.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the pressed state (e.g., mousedown).
     * @param isPressed True if pressed, false otherwise.
     */
    press(isPressed: boolean): void;
    /**
     * Handles keyboard interaction (e.g., Space key).
     * @param originalEvent The KeyboardEvent.
     */
    keydown(originalEvent: KeyboardEvent): import("./interaction-strategies").InteractionResult;
}
//# sourceMappingURL=headless-checkbox.d.ts.map