
import { HeadlessComponent, BaseComponentState } from './headless-component';
import { SliderUpdateStrategy, SliderKeyboardStrategy, HoverStrategy, FocusStrategy, InteractionPayload } from './interaction-strategies';

export interface SliderState extends BaseComponentState {
    value: number;
    min: number;
    max: number;
    step: number;
}

export class HeadlessSlider extends HeadlessComponent<SliderState> {
    defineInitialState(): SliderState {
        return {
            value: 0,
            min: 0,
            max: 100,
            step: 1,
            isDisabled: false,
            isHovered: false,
            isFocused: false,
            isPressed: false, // Represents if the slider thumb is actively being dragged
            error: null,
        };
    }

    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('update', new SliderUpdateStrategy());
        this.interactionStrategies.set('hover', new HoverStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy());
        this.interactionStrategies.set('keyboard', new SliderKeyboardStrategy());
    }

    updateCurrentStateBasedOnData(stateData: SliderState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isPressed) this.transitionToState('pressed'); // Thumb is being dragged
        else if (stateData.isFocused) this.transitionToState('focused');
        else if (stateData.isHovered) this.transitionToState('hovered');
        else this.transitionToState('idle');
    }

    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            'data-focused': String(this.state.isFocused),
            'data-pressed': String(this.state.isPressed),
            ...(this.state.error && { 'data-error': 'true' }),
            'aria-valuenow': String(this.state.value),
            'aria-valuemin': String(this.state.min),
            'aria-valuemax': String(this.state.max),
            'aria-orientation': 'horizontal', // Assuming horizontal, can be made configurable
        };
    }

    // Public API methods
    setValue(newValue: number, originalEvent?: Event | React.SyntheticEvent) {
        // This method can be called directly to set the value, e.g., from a drag operation.
        // The SliderUpdateStrategy will clamp and step the value.
        return this.handleInteraction('update', { value: newValue, originalEvent } as InteractionPayload & { value: number });
    }

    setRange(min: number, max: number, step: number = this.state.step) {
        const currentValue = this.state.value;
        let newValue = Math.max(min, Math.min(max, currentValue)); // Clamp current value to new range
        newValue = Math.round((newValue - min) / step) * step + min; // Adhere to new step
        newValue = Math.max(min, Math.min(max, newValue));

        this.setState({ min, max, step, value: newValue });
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
        // This typically corresponds to mousedown on the thumb
      this.setState({ isPressed });
    }
    
    keydown(originalEvent: KeyboardEvent) {
        return this.handleInteraction('keyboard', { key: originalEvent.key, originalEvent } as InteractionPayload & { key: string, originalEvent: KeyboardEvent });
    }
}

    