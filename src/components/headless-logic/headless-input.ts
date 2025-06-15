import { HeadlessComponent, BaseComponentState } from './headless-component';
import { InputTextStrategy, FocusStrategy, InteractionPayload } from './interaction-strategies';

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
export class HeadlessInput extends HeadlessComponent<InputState> {
    /**
     * Defines the initial state for the input.
     * @returns The initial input state.
     */
    defineInitialState(): InputState {
        return {
            value: '',
            isFocused: false,
            isDisabled: false,
            isReadOnly: false,
            error: null,
            isValid: true, // Assume valid by default
        };
    }

    /**
     * Sets up default interaction strategies for the input.
     * Includes strategies for text input and focus.
     */
    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('input', new InputTextStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy());
    }

    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the input.
     */
    updateCurrentStateBasedOnData(stateData: InputState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error'); // Error implies !isValid
        else if (stateData.isFocused) this.transitionToState('focused');
        // Note: isReadOnly does not have a dedicated visual state here, it's a data attribute.
        else this.transitionToState('idle');
    }

    /**
     * Gets the data attributes for the input element.
     * @returns A record of data attributes including `data-readonly`, `data-valid`.
     */
    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            'data-readonly': String(this.state.isReadOnly),
            'data-valid': String(this.state.isValid), // Reflects validity state
            ...(this.state.error && { 'data-error': 'true' }),
        };
    }

    // --- Public API methods ---

    /**
     * Sets the value of the input field.
     * @param newValue The new value for the input.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the input interaction.
     */
    setValue(newValue: string, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('input', { value: newValue, originalEvent } as InteractionPayload & { value: string });
    }

    /**
     * Sets the disabled state of the input.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }

    /**
     * Sets the read-only state of the input.
     * @param readOnly True to make read-only, false otherwise.
     */
    setReadOnly(readOnly: boolean) {
        this.setState({ isReadOnly: readOnly });
    }

    /**
     * Sets an error state for the input and updates its validity.
     * Setting an error implies the input is not valid. Clearing the error implies it is valid
     * (unless other validation logic sets `isValid` to false separately).
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null) {
        this.setState({ error: error, isValid: !error });
    }

    /**
     * Sets the validity state of the input.
     * This can be used by external validation logic.
     * @param isValid True if the input is valid, false otherwise.
     */
    setValid(isValid: boolean) {
        this.setState({ isValid: isValid });
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
}
