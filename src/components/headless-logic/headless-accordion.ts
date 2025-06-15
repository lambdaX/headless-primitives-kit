
import { HeadlessComponent, BaseComponentState } from './headless-component';
import { AccordionToggleItemStrategy, FocusStrategy, InteractionPayload } from './interaction-strategies';

export interface AccordionState extends BaseComponentState {
    openItems: string[]; // IDs of currently open items
    type: 'single' | 'multiple'; // Determines if multiple items can be open
    collapsible: boolean; // If 'single' type, whether the open item can be closed by clicking again
}

export class HeadlessAccordion extends HeadlessComponent<AccordionState> {
    defineInitialState(): AccordionState {
        return {
            openItems: [],
            type: 'single',
            collapsible: false,
            isDisabled: false,
            isFocused: false,
            error: null,
        };
    }

    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('toggleItem', new AccordionToggleItemStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy()); // Group-level focus
    }

    updateCurrentStateBasedOnData(stateData: AccordionState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isFocused) this.transitionToState('focused');
        else this.transitionToState('idle');
    }

    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            'data-type': this.state.type,
            'data-collapsible': String(this.state.collapsible),
            ...(this.state.error && { 'data-error': 'true' }),
            'data-focused': String(this.state.isFocused),
        };
    }

    // Public API methods
    toggleItem(itemId: string, itemDisabled?: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('toggleItem', { itemId, itemDisabled, originalEvent } as InteractionPayload & { itemId: string, itemDisabled?: boolean });
    }

    setOpenItems(openItems: string[]) {
        this.setState({ openItems });
    }

    setType(type: 'single' | 'multiple') {
        // When changing type, it might be good to reset openItems or apply new logic.
        // For now, just set the type. Consider resetting openItems if changing from multiple to single with many open.
        if (type === 'single' && this.state.openItems.length > 1) {
            this.setState({ type, openItems: [this.state.openItems[0]] }); // Keep only the first open item
        } else {
            this.setState({ type });
        }
    }

    setCollapsible(collapsible: boolean) {
        this.setState({ collapsible });
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
