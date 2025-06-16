/// <reference types="react" />
import { HeadlessComponent, BaseComponentState } from './headless-component';
/**
 * Defines the state properties for a `HeadlessInput` component.
 */
export interface InputState extends BaseComponentState {
    /** The current value of the input field. */
    value: string;
    /** Whether the input field is read-only. */
    isReadOnly: boolean;
    /** Whether the current value is considered valid (e.g., against validation rules). */
    isValid: boolean;
}
/**
 * Manages the state and interactions for a text input component.
 */
export declare class HeadlessInput extends HeadlessComponent<InputState> {
    /**
     * Defines the initial state for the input.
     * @returns The initial input state.
     */
    defineInitialState(): InputState;
    /**
     * Sets up default interaction strategies for the input.
     * Includes strategies for text input and focus.
     */
    protected setupDefaultStrategies(): void;
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the input.
     */
    updateCurrentStateBasedOnData(stateData: InputState): void;
    /**
     * Gets the data attributes for the input element.
     * @returns A record of data attributes including `data-readonly`, `data-valid`.
     */
    getDataAttributes(): Record<string, string>;
    /**
     * Sets the value of the input field.
     * @param newValue The new value for the input.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the input interaction.
     */
    setValue(newValue: string, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the disabled state of the input.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean): void;
    /**
     * Sets the read-only state of the input.
     * @param readOnly True to make read-only, false otherwise.
     */
    setReadOnly(readOnly: boolean): void;
    /**
     * Sets an error state for the input and updates its validity.
     * Setting an error implies the input is not valid. Clearing the error implies it is valid
     * (unless other validation logic sets `isValid` to false separately).
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null): void;
    /**
     * Sets the validity state of the input.
     * This can be used by external validation logic.
     * @param isValid True if the input is valid, false otherwise.
     */
    setValid(isValid: boolean): void;
    /**
     * Handles focus interaction.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
}
//# sourceMappingURL=headless-input.d.ts.map