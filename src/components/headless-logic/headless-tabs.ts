
import { HeadlessComponent, BaseComponentState } from './headless-component';
import { TabsActivateTabStrategy, FocusStrategy, InteractionPayload } from './interaction-strategies';

export interface TabsState extends BaseComponentState {
    activeTab: string | null; // ID of the currently active tab
    orientation: 'horizontal' | 'vertical';
}

export class HeadlessTabs extends HeadlessComponent<TabsState> {
    defineInitialState(): TabsState {
        return {
            activeTab: null,
            orientation: 'horizontal',
            isDisabled: false,
            isFocused: false, // Group-level focus
            error: null,
        };
    }

    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('activateTab', new TabsActivateTabStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy()); // Group-level focus
    }

    updateCurrentStateBasedOnData(stateData: TabsState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isFocused) this.transitionToState('focused');
        else this.transitionToState('idle');
    }

    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            'data-orientation': this.state.orientation,
            ...(this.state.activeTab && { 'data-active-tab': this.state.activeTab }),
            ...(this.state.error && { 'data-error': 'true' }),
            'data-focused': String(this.state.isFocused),
        };
    }

    // Public API methods
    activateTab(tabId: string, tabDisabled?: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('activateTab', { tabId, tabDisabled, originalEvent } as InteractionPayload & { tabId: string, tabDisabled?: boolean });
    }

    setActiveTab(activeTab: string | null) {
        this.setState({ activeTab });
    }

    setOrientation(orientation: 'horizontal' | 'vertical') {
        this.setState({ orientation });
    }

    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }

    setError(error: any | null) {
        this.setState({ error: error });
    }

    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent } as InteractionPayload & { isFocused: boolean });
    }
}
