import { HeadlessComponent, BaseComponentState } from './headless-component';
import { ToggleClickStrategy, HoverStrategy, FocusStrategy, KeyboardStrategy, InteractionPayload } from './interaction-strategies';

export interface CheckboxState extends BaseComponentState {
    isChecked: boolean;
    isIndeterminate: boolean;
}

export class HeadlessCheckbox extends HeadlessComponent<CheckboxState> {
    defineInitialState(): CheckboxState {
        return {
            isChecked: false,
            isIndeterminate: false,
            isDisabled: false,
            isHovered: false,
            isFocused: false,
            isPressed: false,
            error: null,
        };
    }
    
    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('click', new ToggleClickStrategy()); // Uses the same toggle logic
        this.interactionStrategies.set('hover', new HoverStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy());
        this.interactionStrategies.set('keyboard', new KeyboardStrategy());
    }
    
    updateCurrentStateBasedOnData(stateData: CheckboxState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isPressed) this.transitionToState('pressed');
        else if (stateData.isFocused) this.transitionToState('focused');
        else if (stateData.isHovered) this.transitionToState('hovered');
        else this.transitionToState('idle');
    }
    
    getDataAttributes(): Record<string, string> {
        return {
            'data-checked': String(this.state.isChecked),
            'data-indeterminate': String(this.state.isIndeterminate),
            'data-disabled': String(this.state.isDisabled),
            ...(this.state.error && { 'data-error': 'true' }),
        };
    }
    
    // Public API methods
    toggle(originalEvent?: Event | React.SyntheticEvent) {
        if (this.state.isIndeterminate) {
            if (this.setState({ isChecked: true, isIndeterminate: false })) {
                 this.notifyObservers('toggled', { checked: true, fromIndeterminate: true, originalEvent });
            }
        } else {
            return this.handleInteraction('click', { originalEvent });
        }
    }
    
    check() {
        if (!this.state.isChecked || this.state.isIndeterminate) {
            if(this.setState({ isChecked: true, isIndeterminate: false })) {
                this.notifyObservers('toggled', { checked: true });
            }
        }
    }
    
    uncheck() {
        if (this.state.isChecked || this.state.isIndeterminate) {
            if(this.setState({ isChecked: false, isIndeterminate: false })) {
                this.notifyObservers('toggled', { checked: false });
            }
        }
    }

    setIndeterminate(indeterminate: boolean) {
        // When setting indeterminate, isChecked is usually false by convention
        this.setState({ isIndeterminate: indeterminate, isChecked: indeterminate ? false : this.state.isChecked });
    }
    
    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }
    
    setError(error: any | null) {
        this.setState({ error: error });
    }
    
    hover(isHovered: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('hover', { isHovered, originalEvent } as InteractionPayload & { isHovered: boolean });
    }
    
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent } as InteractionPayload & { isFocused: boolean });
    }

    press(isPressed: boolean) {
        this.setState({ isPressed });
    }
    
    keydown(originalEvent: KeyboardEvent) {
        return this.handleInteraction('keyboard', { key: originalEvent.key, originalEvent } as InteractionPayload & { key: string, originalEvent: KeyboardEvent });
    }
}
