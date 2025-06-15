import { HeadlessComponent, BaseComponentState } from './headless-component';
import { SliderUpdateStrategy, SliderKeyboardStrategy, HoverStrategy, FocusStrategy, InteractionPayload } from './interaction-strategies';

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
    // isPressed: true when the thumb is being actively dragged.
}

/**
 * Manages the state and interactions for a slider component.
 * Sliders allow users to select a value from a continuous or discrete range.
 */
export class HeadlessSlider extends HeadlessComponent<SliderState> {
    /**
     * Defines the initial state for the slider.
     * @returns The initial slider state.
     */
    defineInitialState(): SliderState {
        return {
            value: 0,
            min: 0,
            max: 100,
            step: 1,
            isDisabled: false,
            isHovered: false, // Hover state for the slider track or thumb
            isFocused: false, // Focus state for the slider thumb
            isPressed: false, // True if the thumb is actively being dragged
            error: null,
        };
    }

    /**
     * Sets up default interaction strategies for the slider.
     */
    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('update', new SliderUpdateStrategy()); // For direct value changes (e.g., drag)
        this.interactionStrategies.set('hover', new HoverStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy()); // Typically for the thumb
        this.interactionStrategies.set('keyboard', new SliderKeyboardStrategy()); // Arrow keys, Home, End
    }

    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the slider.
     */
    updateCurrentStateBasedOnData(stateData: SliderState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isPressed) this.transitionToState('pressed'); // Thumb is being dragged
        else if (stateData.isFocused) this.transitionToState('focused');
        else if (stateData.isHovered) this.transitionToState('hovered');
        else this.transitionToState('idle');
    }

    /**
     * Gets the data attributes for the slider element, primarily for ARIA support.
     * @returns A record of data attributes including ARIA value attributes.
     */
    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            'data-focused': String(this.state.isFocused), // Usually on the thumb
            'data-pressed': String(this.state.isPressed), // Thumb is active
            ...(this.state.error && { 'data-error': 'true' }),
            'aria-valuenow': String(this.state.value),
            'aria-valuemin': String(this.state.min),
            'aria-valuemax': String(this.state.max),
            'aria-orientation': 'horizontal', // Assuming horizontal; could be made configurable
            // 'aria-disabled': String(this.state.isDisabled), // Covered by HTML disabled on input usually
        };
    }

    // --- Public API methods ---

    /**
     * Sets the value of the slider. The value will be clamped to min/max and adjusted to the nearest step.
     * @param newValue The desired new value.
     * @param originalEvent Optional. The original browser or React event (e.g., mousemove during drag).
     * @returns The result of the update interaction.
     */
    setValue(newValue: number, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('update', { value: newValue, originalEvent } as InteractionPayload & { value: number });
    }

    /**
     * Sets the range (min, max) and step for the slider.
     * The current value will be adjusted to fit within the new range and step.
     * @param min The new minimum value.
     * @param max The new maximum value.
     * @param step The new step value (defaults to current step if not provided).
     */
    setRange(min: number, max: number, step: number = this.state.step) {
        if (min >= max) {
            console.warn("Slider setRange: min value must be less than max value.");
            return;
        }
        if (step <= 0) {
            console.warn("Slider setRange: step value must be positive.");
            return;
        }

        const currentValue = this.state.value;
        let newValue = Math.max(min, Math.min(max, currentValue)); // Clamp current value to new range
        
        // Adhere to new step, ensuring it's correctly aligned with the new min
        newValue = Math.round((newValue - min) / step) * step + min; 
        newValue = Math.max(min, Math.min(max, newValue)); // Clamp again after step adjustment

        this.setState({ min, max, step, value: newValue });
    }

    /**
     * Sets the disabled state of the slider.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }

    /**
     * Sets an error state for the slider.
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null) {
        this.setState({ error: error });
    }
    
    /**
     * Handles hover interaction, typically for the slider track or thumb.
     * @param isHovered True if hovering, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the hover interaction.
     */
    hover(isHovered: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('hover', { isHovered, originalEvent } as InteractionPayload & { isHovered: boolean });
    }
    
    /**
     * Handles focus interaction, typically for the slider thumb.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent } as InteractionPayload & { isFocused: boolean });
    }

    /**
     * Sets the pressed state, usually when the slider thumb is actively being dragged.
     * @param isPressed True if pressed/dragged, false otherwise.
     */
    press(isPressed: boolean) {
        if (this.state.isDisabled) return;
        this.setState({ isPressed });
    }
    
    /**
     * Handles keyboard interactions for changing the slider value (e.g., arrow keys, Home, End).
     * @param originalEvent The KeyboardEvent.
     * @returns The result of the keyboard interaction.
     */
    keydown(originalEvent: KeyboardEvent) {
        return this.handleInteraction('keyboard', { key: originalEvent.key, originalEvent } as InteractionPayload & { key: string, originalEvent: KeyboardEvent });
    }
}
