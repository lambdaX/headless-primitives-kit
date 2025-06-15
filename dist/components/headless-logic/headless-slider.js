"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeadlessSlider = void 0;
const headless_component_1 = require("./headless-component");
const interaction_strategies_1 = require("./interaction-strategies");
/**
 * Manages the state and interactions for a slider component.
 * Sliders allow users to select a value from a continuous or discrete range.
 */
class HeadlessSlider extends headless_component_1.HeadlessComponent {
    /**
     * Defines the initial state for the slider.
     * @returns The initial slider state.
     */
    defineInitialState() {
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
    setupDefaultStrategies() {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('update', new interaction_strategies_1.SliderUpdateStrategy()); // For direct value changes (e.g., drag)
        this.interactionStrategies.set('hover', new interaction_strategies_1.HoverStrategy());
        this.interactionStrategies.set('focus', new interaction_strategies_1.FocusStrategy()); // Typically for the thumb
        this.interactionStrategies.set('keyboard', new interaction_strategies_1.SliderKeyboardStrategy()); // Arrow keys, Home, End
    }
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the slider.
     */
    updateCurrentStateBasedOnData(stateData) {
        if (stateData.isDisabled)
            this.transitionToState('disabled');
        else if (stateData.error)
            this.transitionToState('error');
        else if (stateData.isPressed)
            this.transitionToState('pressed'); // Thumb is being dragged
        else if (stateData.isFocused)
            this.transitionToState('focused');
        else if (stateData.isHovered)
            this.transitionToState('hovered');
        else
            this.transitionToState('idle');
    }
    /**
     * Gets the data attributes for the slider element, primarily for ARIA support.
     * @returns A record of data attributes including ARIA value attributes.
     */
    getDataAttributes() {
        return Object.assign(Object.assign({ 'data-disabled': String(this.state.isDisabled), 'data-focused': String(this.state.isFocused), 'data-pressed': String(this.state.isPressed) }, (this.state.error && { 'data-error': 'true' })), { 'aria-valuenow': String(this.state.value), 'aria-valuemin': String(this.state.min), 'aria-valuemax': String(this.state.max), 'aria-orientation': 'horizontal' });
    }
    // --- Public API methods ---
    /**
     * Sets the value of the slider. The value will be clamped to min/max and adjusted to the nearest step.
     * @param newValue The desired new value.
     * @param originalEvent Optional. The original browser or React event (e.g., mousemove during drag).
     * @returns The result of the update interaction.
     */
    setValue(newValue, originalEvent) {
        return this.handleInteraction('update', { value: newValue, originalEvent });
    }
    /**
     * Sets the range (min, max) and step for the slider.
     * The current value will be adjusted to fit within the new range and step.
     * @param min The new minimum value.
     * @param max The new maximum value.
     * @param step The new step value (defaults to current step if not provided).
     */
    setRange(min, max, step = this.state.step) {
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
    setDisabled(disabled) {
        this.setState({ isDisabled: disabled });
    }
    /**
     * Sets an error state for the slider.
     * @param error The error object or message. Null to clear.
     */
    setError(error) {
        this.setState({ error: error });
    }
    /**
     * Handles hover interaction, typically for the slider track or thumb.
     * @param isHovered True if hovering, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the hover interaction.
     */
    hover(isHovered, originalEvent) {
        return this.handleInteraction('hover', { isHovered, originalEvent });
    }
    /**
     * Handles focus interaction, typically for the slider thumb.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused, originalEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent });
    }
    /**
     * Sets the pressed state, usually when the slider thumb is actively being dragged.
     * @param isPressed True if pressed/dragged, false otherwise.
     */
    press(isPressed) {
        if (this.state.isDisabled)
            return;
        this.setState({ isPressed });
    }
    /**
     * Handles keyboard interactions for changing the slider value (e.g., arrow keys, Home, End).
     * @param originalEvent The KeyboardEvent.
     * @returns The result of the keyboard interaction.
     */
    keydown(originalEvent) {
        return this.handleInteraction('keyboard', { key: originalEvent.key, originalEvent });
    }
}
exports.HeadlessSlider = HeadlessSlider;
//# sourceMappingURL=headless-slider.js.map