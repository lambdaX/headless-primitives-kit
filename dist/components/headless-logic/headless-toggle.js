import { HeadlessComponent } from './headless-component';
import { ToggleClickStrategy, HoverStrategy, FocusStrategy, KeyboardStrategy } from './interaction-strategies';
/**
 * Manages the state and interactions for a toggle component, such as a switch.
 * Toggles typically have two states: checked (on) and unchecked (off).
 */
export class HeadlessToggle extends HeadlessComponent {
    /**
     * Defines the initial state for the toggle.
     * @returns The initial toggle state.
     */
    defineInitialState() {
        return {
            isChecked: false,
            isDisabled: false,
            isHovered: false,
            isFocused: false,
            isPressed: false,
            isLoading: false,
            error: null,
        };
    }
    /**
     * Sets up default interaction strategies for the toggle.
     */
    setupDefaultStrategies() {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('click', new ToggleClickStrategy());
        this.interactionStrategies.set('hover', new HoverStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy());
        this.interactionStrategies.set('keyboard', new KeyboardStrategy()); // For Space/Enter to toggle
    }
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the toggle.
     */
    updateCurrentStateBasedOnData(stateData) {
        if (stateData.isDisabled)
            this.transitionToState('disabled');
        else if (stateData.isLoading)
            this.transitionToState('loading');
        else if (stateData.error)
            this.transitionToState('error');
        else if (stateData.isPressed)
            this.transitionToState('pressed');
        else if (stateData.isFocused)
            this.transitionToState('focused');
        else if (stateData.isHovered)
            this.transitionToState('hovered');
        else
            this.transitionToState('idle');
        // Note: isChecked is reflected in data-attributes, not a separate visual state here.
    }
    /**
     * Gets the data attributes for the toggle element.
     * @returns A record of data attributes including `data-checked`.
     */
    getDataAttributes() {
        return Object.assign({ 'data-checked': String(this.state.isChecked), 'data-disabled': String(this.state.isDisabled), 'data-loading': String(this.state.isLoading) }, (this.state.error && { 'data-error': 'true' }));
    }
    // --- Public API methods ---
    /**
     * Toggles the checked state of the component.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the toggle interaction.
     */
    toggle(originalEvent) {
        return this.handleInteraction('click', { originalEvent });
    }
    /**
     * Sets the toggle to its checked (on) state.
     * Does nothing if already checked or disabled.
     */
    check() {
        if (this.state.isDisabled || this.state.isLoading)
            return;
        if (!this.state.isChecked) {
            if (this.setState({ isChecked: true })) {
                this.notifyObservers('toggled', { checked: true });
            }
        }
    }
    /**
     * Sets the toggle to its unchecked (off) state.
     * Does nothing if already unchecked or disabled.
     */
    uncheck() {
        if (this.state.isDisabled || this.state.isLoading)
            return;
        if (this.state.isChecked) {
            if (this.setState({ isChecked: false })) {
                this.notifyObservers('toggled', { checked: false });
            }
        }
    }
    /**
     * Sets the disabled state of the toggle.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled) {
        this.setState({ isDisabled: disabled });
    }
    /**
     * Sets the loading state of the toggle.
     * @param loading True to set to loading, false otherwise.
     */
    setLoading(loading) {
        this.setState({ isLoading: loading });
    }
    /**
     * Sets an error state for the toggle.
     * @param error The error object or message. Null to clear.
     */
    setError(error) {
        this.setState({ error: error });
    }
    /**
     * Handles hover interaction.
     * @param isHovered True if hovering, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the hover interaction.
     */
    hover(isHovered, originalEvent) {
        return this.handleInteraction('hover', { isHovered, originalEvent });
    }
    /**
     * Handles focus interaction.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused, originalEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent });
    }
    /**
     * Sets the pressed state (e.g., mousedown).
     * @param isPressed True if pressed, false otherwise.
     */
    press(isPressed) {
        if (this.state.isDisabled || this.state.isLoading)
            return;
        this.setState({ isPressed });
    }
    /**
     * Handles keyboard interaction (e.g., Space or Enter key).
     * @param originalEvent The KeyboardEvent.
     * @returns The result of the keyboard interaction.
     */
    keydown(originalEvent) {
        return this.handleInteraction('keyboard', { key: originalEvent.key, originalEvent });
    }
}
//# sourceMappingURL=headless-toggle.js.map