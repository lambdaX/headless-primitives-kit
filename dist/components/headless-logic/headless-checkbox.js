import { HeadlessComponent } from './headless-component';
import { ToggleClickStrategy, HoverStrategy, FocusStrategy, KeyboardStrategy } from './interaction-strategies';
/**
 * Manages the state and interactions for a checkbox component.
 * Checkboxes can be checked, unchecked, or indeterminate.
 */
export class HeadlessCheckbox extends HeadlessComponent {
    /**
     * Defines the initial state for the checkbox.
     * @returns The initial checkbox state.
     */
    defineInitialState() {
        return {
            isChecked: false,
            isIndeterminate: false,
            isDisabled: false,
            isHovered: false,
            isFocused: false,
            isPressed: false, // User is actively pressing (e.g. mousedown)
            error: null,
        };
    }
    /**
     * Sets up default interaction strategies for the checkbox.
     * Uses ToggleClickStrategy for its primary action.
     */
    setupDefaultStrategies() {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('click', new ToggleClickStrategy());
        this.interactionStrategies.set('hover', new HoverStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy());
        this.interactionStrategies.set('keyboard', new KeyboardStrategy());
    }
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the checkbox.
     */
    updateCurrentStateBasedOnData(stateData) {
        if (stateData.isDisabled)
            this.transitionToState('disabled');
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
        // Note: isChecked and isIndeterminate are reflected in data-attributes, not separate visual states here.
    }
    /**
     * Gets the data attributes for the checkbox element.
     * @returns A record of data attributes including `data-checked`, `data-indeterminate`.
     */
    getDataAttributes() {
        return {
            'data-checked': String(this.state.isChecked),
            'data-indeterminate': String(this.state.isIndeterminate),
            'data-disabled': String(this.state.isDisabled),
            ...(this.state.error && { 'data-error': 'true' }),
        };
    }
    /**
     * Explicitly define notifyObservers to aid type resolution, calling the superclass implementation.
     */
    notifyObservers(event, data) {
        super.notifyObservers(event, data);
    }
    // --- Public API methods ---
    /**
     * Toggles the checkbox state.
     * If indeterminate, it becomes checked. Otherwise, it toggles between checked and unchecked.
     * @param originalEvent Optional. The original browser or React event.
     */
    toggle(originalEvent) {
        if (this.state.isDisabled)
            return { prevented: true, reason: 'disabled' };
        if (this.state.isIndeterminate) {
            // Transition from indeterminate to checked
            if (this.setState({ isChecked: true, isIndeterminate: false })) {
                this.notifyObservers('toggled', { checked: true, fromIndeterminate: true, originalEvent });
            }
        }
        else {
            // Standard toggle behavior (uses ToggleClickStrategy)
            return this.handleInteraction('click', { originalEvent });
        }
        return { prevented: false, handled: true };
    }
    /**
     * Sets the checkbox state to checked and clears indeterminate state.
     */
    check() {
        if (this.state.isDisabled)
            return;
        if (!this.state.isChecked || this.state.isIndeterminate) {
            if (this.setState({ isChecked: true, isIndeterminate: false })) {
                this.notifyObservers('toggled', { checked: true });
            }
        }
    }
    /**
     * Sets the checkbox state to unchecked and clears indeterminate state.
     */
    uncheck() {
        if (this.state.isDisabled)
            return;
        if (this.state.isChecked || this.state.isIndeterminate) {
            if (this.setState({ isChecked: false, isIndeterminate: false })) {
                this.notifyObservers('toggled', { checked: false });
            }
        }
    }
    /**
     * Sets the indeterminate state of the checkbox.
     * When a checkbox is set to indeterminate, `isChecked` is typically set to `false`
     * as per common UI conventions, though the visual representation is distinct.
     * @param indeterminate True to set to indeterminate, false to clear.
     */
    setIndeterminate(indeterminate) {
        if (this.state.isDisabled)
            return;
        this.setState({
            isIndeterminate: indeterminate,
            isChecked: indeterminate ? false : this.state.isChecked
        });
    }
    /**
     * Sets the disabled state of the checkbox.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled) {
        this.setState({ isDisabled: disabled });
    }
    /**
     * Sets an error state for the checkbox.
     * @param error The error object or message. Null to clear.
     */
    setError(error) {
        this.setState({ error: error });
    }
    /**
     * Handles hover interaction.
     * @param isHovered True if hovering, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     */
    hover(isHovered, originalEvent) {
        return this.handleInteraction('hover', { isHovered, originalEvent });
    }
    /**
     * Handles focus interaction.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     */
    focus(isFocused, originalEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent });
    }
    /**
     * Sets the pressed state (e.g., mousedown).
     * @param isPressed True if pressed, false otherwise.
     */
    press(isPressed) {
        if (this.state.isDisabled)
            return;
        this.setState({ isPressed });
    }
    /**
     * Handles keyboard interaction (e.g., Space key).
     * @param originalEvent The KeyboardEvent.
     */
    keydown(originalEvent) {
        return this.handleInteraction('keyboard', { key: originalEvent.key, originalEvent });
    }
}
//# sourceMappingURL=headless-checkbox.js.map