
import { HeadlessComponent, BaseComponentState } from './headless-component';
import { ButtonClickStrategy, HoverStrategy, FocusStrategy, KeyboardStrategy, InteractionPayload } from './interaction-strategies';

export interface ButtonState extends BaseComponentState {}

export class HeadlessButton extends HeadlessComponent<ButtonState> {
    defineInitialState(): ButtonState {
        return {
            isDisabled: false,
            isHovered: false,
            isFocused: false,
            isPressed: false,
            isLoading: false,
            error: null,
        };
    }

    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('click', new ButtonClickStrategy());
        this.interactionStrategies.set('hover', new HoverStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy());
        this.interactionStrategies.set('keyboard', new KeyboardStrategy());
    }

    updateCurrentStateBasedOnData(stateData: ButtonState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.isLoading) this.transitionToState('loading');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isPressed) this.transitionToState('pressed');
        else if (stateData.isFocused) this.transitionToState('focused');
        else if (stateData.isHovered) this.transitionToState('hovered');
        else this.transitionToState('idle');
    }

    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            'data-loading': String(this.state.isLoading),
            ...(this.state.error && { 'data-error': 'true' }),
        };
    }

    // Public API methods
    click(originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('click', { originalEvent });
    }

    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }

    setLoading(loading: boolean) {
        this.setState({ isLoading: loading });
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
