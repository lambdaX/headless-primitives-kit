import { HeadlessComponent, BaseComponentState } from './headless-component';
import { InputTextStrategy, FocusStrategy, InteractionPayload } from './interaction-strategies';

export interface InputState extends BaseComponentState {
    value: string;
    isReadOnly: boolean;
    isValid: boolean;
}

export class HeadlessInput extends HeadlessComponent<InputState> {
    defineInitialState(): InputState {
        return {
            value: '',
            isFocused: false,
            isDisabled: false,
            isReadOnly: false,
            error: null,
            isValid: true,
        };
    }

    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('input', new InputTextStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy());
        // Note: KeyboardStrategy for general key events (like Enter/Space) is not typically added to inputs by default.
        // Specific key handling (e.g. for submission) would be an application-level concern or a more specialized strategy.
    }

    updateCurrentStateBasedOnData(stateData: InputState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error'); // Error implies !isValid
        else if (stateData.isFocused) this.transitionToState('focused');
        else this.transitionToState('idle');
    }

    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            'data-readonly': String(this.state.isReadOnly),
            'data-valid': String(this.state.isValid),
            ...(this.state.error && { 'data-error': 'true' }),
        };
    }

    // Public API methods
    setValue(newValue: string, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('input', { value: newValue, originalEvent } as InteractionPayload & { value: string });
    }

    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }

    setReadOnly(readOnly: boolean) {
        this.setState({ isReadOnly: readOnly });
    }

    setError(error: any | null) {
        // Setting an error implies the input is not valid
        this.setState({ error: error, isValid: !error });
    }
    
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent } as InteractionPayload & { isFocused: boolean });
    }
}
