import { HeadlessComponent } from './headless-component.js';
import { RadioItemSelectStrategy, FocusStrategy } from './interaction-strategies.js';
/**
 * Manages the state and interactions for a group of radio buttons.
 * Only one radio button in a group can be selected at a time.
 */
export class HeadlessRadioGroup extends HeadlessComponent {
    /**
     * Defines the initial state for the radio group.
     * @returns The initial radio group state.
     */
    defineInitialState() {
        return {
            value: null,
            options: [],
            isDisabled: false, // Disables the entire group
            isFocused: false, // Focus state for the group container
            error: null,
        };
    }
    /**
     * Sets up default interaction strategies for the radio group.
     */
    setupDefaultStrategies() {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('select', new RadioItemSelectStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy()); // For group focus
    }
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the radio group.
     */
    updateCurrentStateBasedOnData(stateData) {
        if (stateData.isDisabled)
            this.transitionToState('disabled');
        else if (stateData.error)
            this.transitionToState('error');
        else if (stateData.isFocused)
            this.transitionToState('focused'); // Group focus
        else
            this.transitionToState('idle');
    }
    /**
     * Gets the data attributes for the radio group element.
     * @returns A record of data attributes.
     */
    getDataAttributes() {
        return Object.assign(Object.assign({ 'data-disabled': String(this.state.isDisabled) }, (this.state.error && { 'data-error': 'true' })), { 'data-focused': String(this.state.isFocused) });
    }
    // --- Public API methods ---
    /**
     * Selects a radio option within the group by its value.
     * Does nothing if the group or the specific option is disabled.
     * @param value The value of the radio option to select.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the selection interaction.
     */
    selectOption(value, originalEvent) {
        const option = this.state.options.find(opt => opt.value === value);
        if (this.state.isDisabled || (option && option.disabled)) {
            return { prevented: true, reason: (option === null || option === void 0 ? void 0 : option.disabled) ? 'option disabled' : 'group disabled' };
        }
        return this.handleInteraction('select', { value, originalEvent });
    }
    /**
     * Sets the available radio options for the group.
     * @param options An array of `RadioOption` objects.
     */
    setOptions(options) {
        // Consider what happens if the current value is no longer in the new options.
        // For now, it will remain, but UI might need to handle this.
        this.setState({ options });
    }
    /**
     * Programmatically sets the selected value of the radio group.
     * If the provided value does not correspond to an enabled option, the selection may not change
     * or could be cleared, depending on desired strictness (currently allows setting if valid).
     * @param value The value of the option to select, or null to clear selection.
     */
    setValue(value) {
        const isValidOption = value === null || this.state.options.some(opt => opt.value === value && !opt.disabled);
        if (isValidOption) {
            if (this.state.value !== value) {
                this.setState({ value });
            }
        }
        else if (value !== null) {
            console.warn(`Attempted to set invalid or disabled value "${value}" for HeadlessRadioGroup.`);
        }
    }
    /**
     * Sets the disabled state of the entire radio group.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled) {
        this.setState({ isDisabled: disabled });
    }
    /**
     * Sets an error state for the radio group.
     * @param error The error object or message. Null to clear.
     */
    setError(error) {
        this.setState({ error: error });
    }
    /**
     * Handles focus interaction for the radio group container.
     * @param isFocused True if the group container is focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused, originalEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent });
    }
}
//# sourceMappingURL=headless-radio-group.js.map