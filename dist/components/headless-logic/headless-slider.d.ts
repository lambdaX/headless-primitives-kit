import { HeadlessComponent, BaseComponentState } from './headless-component';
/**
 * Defines the state properties for a `HeadlessSlider` component.
 */
export interface SliderState extends BaseComponentState {
    /** The current numerical value of the slider. */
    value: number;
    /** The minimum value of the slider. */
    min: number;
    /** The maximum value of the slider. */
    max: number;
    /** The step increment/decrement value of the slider. */
    step: number;
}
/**
 * Manages the state and interactions for a slider component.
 * Sliders allow users to select a value from a continuous or discrete range.
 */
export declare class HeadlessSlider extends HeadlessComponent<SliderState> {
    /**
     * Defines the initial state for the slider.
     * @returns The initial slider state.
     */
    defineInitialState(): SliderState;
    /**
     * Sets up default interaction strategies for the slider.
     */
    protected setupDefaultStrategies(): void;
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the slider.
     */
    updateCurrentStateBasedOnData(stateData: SliderState): void;
    /**
     * Gets the data attributes for the slider element, primarily for ARIA support.
     * @returns A record of data attributes including ARIA value attributes.
     */
    getDataAttributes(): Record<string, string>;
    /**
     * Sets the value of the slider. The value will be clamped to min/max and adjusted to the nearest step.
     * @param newValue The desired new value.
     * @param originalEvent Optional. The original browser or React event (e.g., mousemove during drag).
     * @returns The result of the update interaction.
     */
    setValue(newValue: number, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the range (min, max) and step for the slider.
     * The current value will be adjusted to fit within the new range and step.
     * @param min The new minimum value.
     * @param max The new maximum value.
     * @param step The new step value (defaults to current step if not provided).
     */
    setRange(min: number, max: number, step?: number): void;
    /**
     * Sets the disabled state of the slider.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean): void;
    /**
     * Sets an error state for the slider.
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null): void;
    /**
     * Handles hover interaction, typically for the slider track or thumb.
     * @param isHovered True if hovering, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the hover interaction.
     */
    hover(isHovered: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Handles focus interaction, typically for the slider thumb.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the pressed state, usually when the slider thumb is actively being dragged.
     * @param isPressed True if pressed/dragged, false otherwise.
     */
    press(isPressed: boolean): void;
    /**
     * Handles keyboard interactions for changing the slider value (e.g., arrow keys, Home, End).
     * @param originalEvent The KeyboardEvent.
     * @returns The result of the keyboard interaction.
     */
    keydown(originalEvent: KeyboardEvent): import("./interaction-strategies").InteractionResult;
}
//# sourceMappingURL=headless-slider.d.ts.map