import { HeadlessComponent, BaseComponentState } from './headless-component.ts';
import { ToggleClickStrategy, HoverStrategy, FocusStrategy, KeyboardStrategy, InteractionPayload } from './interaction-strategies.ts';

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
export class HeadlessToggle extends HeadlessComponent<ToggleState> {
    /**
     * Defines the initial state for the toggle.
     * @returns The initial toggle state.
     */
    defineInitialState(): ToggleState {
        return {
            isChecked: false,
            isDisabled: false,
            isHovered: false,
            isFocused: false,
            isPressed: false, // User is actively pressing (e.g. mousedown)
            isLoading: false,
            error: null,
        };
    }
    
    /**
     * Sets up default interaction strategies for the toggle.
     */
    protected setupDefaultStrategies(): void {
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
    updateCurrentStateBasedOnData(stateData: ToggleState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.isLoading) this.transitionToState('loading');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isPressed) this.transitionToState('pressed');
        else if (stateData.isFocused) this.transitionToState('focused');
        else if (stateData.isHovered) this.transitionToState('hovered');
        else this.transitionToState('idle');
        // Note: isChecked is reflected in data-attributes, not a separate visual state here.
    }
    
    /**
     * Gets the data attributes for the toggle element.
     * @returns A record of data attributes including `data-checked`.
     */
    getDataAttributes(): Record<string, string> {
        return {
            'data-checked': String(this.state.isChecked),
            'data-disabled': String(this.state.isDisabled),
            'data-loading': String(this.state.isLoading),
            ...(this.state.error && { 'data-error': 'true' }),
        };
    }
    
    // --- Public API methods ---

    /**
     * Toggles the checked state of the component.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the toggle interaction.
     */
    toggle(originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('click', { originalEvent });
    }
    
    /**
     * Sets the toggle to its checked (on) state.
     * Does nothing if already checked or disabled.
     */
    check() {
        if (this.state.isDisabled || this.state.isLoading) return;
        if (!this.state.isChecked) {
            if(this.setState({ isChecked: true })) {
                this.notifyObservers('toggled', { checked: true });
            }
        }
    }
    
    /**
     * Sets the toggle to its unchecked (off) state.
     * Does nothing if already unchecked or disabled.
     */
    uncheck() {
        if (this.state.isDisabled || this.state.isLoading) return;
        if (this.state.isChecked) {
             if(this.setState({ isChecked: false })) {
                this.notifyObservers('toggled', { checked: false });
            }
        }
    }
    
    /**
     * Sets the disabled state of the toggle.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }
    
    /**
     * Sets the loading state of the toggle.
     * @param loading True to set to loading, false otherwise.
     */
    setLoading(loading: boolean) {
        this.setState({ isLoading: loading });
    }
    
    /**
     * Sets an error state for the toggle.
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null) {
        this.setState({ error: error });
    }
    
    /**
     * Handles hover interaction.
     * @param isHovered True if hovering, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the hover interaction.
     */
    hover(isHovered: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('hover', { isHovered, originalEvent } as InteractionPayload & { isHovered: boolean });
    }
    
    /**
     * Handles focus interaction.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent } as InteractionPayload & { isFocused: boolean });
    }

    /**
     * Sets the pressed state (e.g., mousedown).
     * @param isPressed True if pressed, false otherwise.
     */
    press(isPressed: boolean) {
      if (this.state.isDisabled || this.state.isLoading) return;
      this.setState({ isPressed });
    }
    
    /**
     * Handles keyboard interaction (e.g., Space or Enter key).
     * @param originalEvent The KeyboardEvent.
     * @returns The result of the keyboard interaction.
     */
    keydown(originalEvent: KeyboardEvent) {
        return this.handleInteraction('keyboard', { key: originalEvent.key, originalEvent } as InteractionPayload & { key: string, originalEvent: KeyboardEvent });
    }
}
