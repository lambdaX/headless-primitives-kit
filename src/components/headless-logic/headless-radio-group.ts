
import { HeadlessComponent, BaseComponentState } from './headless-component';
import { RadioItemSelectStrategy, FocusStrategy, InteractionPayload } from './interaction-strategies';

export interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface RadioGroupState extends BaseComponentState {
    value: string | null;
    options: RadioOption[];
}

export class HeadlessRadioGroup extends HeadlessComponent<RadioGroupState> {
    defineInitialState(): RadioGroupState {
        return {
            value: null,
            options: [],
            isDisabled: false,
            isFocused: false, // Group-level focus
            error: null,
        };
    }

    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('select', new RadioItemSelectStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy()); // For group focus
    }

    updateCurrentStateBasedOnData(stateData: RadioGroupState): void {
        // Radio group itself doesn't have hover/pressed states like a button.
        // It can be disabled, focused (as a group), or have an error.
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isFocused) this.transitionToState('focused');
        else this.transitionToState('idle');
    }

    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            ...(this.state.error && { 'data-error': 'true' }),
            'data-focused': String(this.state.isFocused), // If group itself can be focused
        };
    }

    // Public API methods
    selectOption(value: string, originalEvent?: Event | React.SyntheticEvent) {
        const option = this.state.options.find(opt => opt.value === value);
        if (option && option.disabled) {
            return { prevented: true, reason: 'option disabled' };
        }
        return this.handleInteraction('select', { value, originalEvent } as InteractionPayload & { value: string });
    }

    setOptions(options: RadioOption[]) {
        this.setState({ options });
    }
    
    setValue(value: string | null) {
        // Directly set value, bypassing strategy if needed for programmatic changes or initialization.
        // Ensure the value is valid among current options if strictness is desired, or allow setting any string.
        const isValidOption = value === null || this.state.options.some(opt => opt.value === value && !opt.disabled);
        if (isValidOption) {
            this.setState({ value });
        } else if (value !== null) {
            console.warn(`Attempted to set invalid or disabled value "${value}" for HeadlessRadioGroup.`);
        }
    }

    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }

    setError(error: any | null) {
        this.setState({ error: error });
    }

    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent) {
        // This refers to the focus state of the entire group, if applicable.
        // Individual radio item focus would typically be handled by the UI rendering them.
        return this.handleInteraction('focus', { isFocused, originalEvent } as InteractionPayload & { isFocused: boolean });
    }
}
