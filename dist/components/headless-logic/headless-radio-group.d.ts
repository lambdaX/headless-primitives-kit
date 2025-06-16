import { HeadlessComponent, BaseComponentState } from './headless-component';
/**
 * Defines the structure for a single radio option within a `HeadlessRadioGroup`.
 */
export interface RadioOption {
    /** The unique value associated with this radio option. */
    value: string;
    /** The human-readable label for this radio option. */
    label: string;
    /** Whether this specific radio option is disabled. Defaults to false. */
    disabled?: boolean;
}
/**
 * Defines the state properties for a `HeadlessRadioGroup` component.
 */
export interface RadioGroupState extends BaseComponentState {
    /** The value of the currently selected radio option, or null if none is selected. */
    value: string | null;
    /** An array of `RadioOption` objects representing the available choices. */
    options: RadioOption[];
}
/**
 * Manages the state and interactions for a group of radio buttons.
 * Only one radio button in a group can be selected at a time.
 */
export declare class HeadlessRadioGroup extends HeadlessComponent<RadioGroupState> {
    /**
     * Defines the initial state for the radio group.
     * @returns The initial radio group state.
     */
    defineInitialState(): RadioGroupState;
    /**
     * Sets up default interaction strategies for the radio group.
     */
    protected setupDefaultStrategies(): void;
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the radio group.
     */
    updateCurrentStateBasedOnData(stateData: RadioGroupState): void;
    /**
     * Gets the data attributes for the radio group element.
     * @returns A record of data attributes.
     */
    getDataAttributes(): Record<string, string>;
    /**
     * Selects a radio option within the group by its value.
     * Does nothing if the group or the specific option is disabled.
     * @param value The value of the radio option to select.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the selection interaction.
     */
    selectOption(value: string, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the available radio options for the group.
     * @param options An array of `RadioOption` objects.
     */
    setOptions(options: RadioOption[]): void;
    /**
     * Programmatically sets the selected value of the radio group.
     * If the provided value does not correspond to an enabled option, the selection may not change
     * or could be cleared, depending on desired strictness (currently allows setting if valid).
     * @param value The value of the option to select, or null to clear selection.
     */
    setValue(value: string | null): void;
    /**
     * Sets the disabled state of the entire radio group.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean): void;
    /**
     * Sets an error state for the radio group.
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null): void;
    /**
     * Handles focus interaction for the radio group container.
     * @param isFocused True if the group container is focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
}
//# sourceMappingURL=headless-radio-group.d.ts.map