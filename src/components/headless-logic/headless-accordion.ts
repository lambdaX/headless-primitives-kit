
import { HeadlessComponent, BaseComponentState } from './headless-component.ts';
import { AccordionToggleItemStrategy, FocusStrategy, InteractionPayload } from './interaction-strategies.ts';

/**
 * Defines the state properties for a `HeadlessAccordion` component.
 */
export interface AccordionState extends BaseComponentState {
    /** An array of item IDs that are currently open. */
    openItems: string[];
    /** 
     * Determines if multiple items can be open simultaneously ('multiple') 
     * or only one item ('single'). 
     */
    type: 'single' | 'multiple';
    /** 
     * If `type` is 'single', determines whether the currently open item 
     * can be closed by clicking it again.
     */
    collapsible: boolean;
}

/**
 * Manages the state and interactions for an accordion component.
 * An accordion allows users to toggle the visibility of content sections.
 */
export class HeadlessAccordion extends HeadlessComponent<AccordionState> {
    /**
     * Defines the initial state for the accordion.
     * @returns The initial accordion state.
     */
    defineInitialState(): AccordionState {
        return {
            openItems: [],
            type: 'single',
            collapsible: false,
            isDisabled: false,
            isFocused: false, // Accordion group can have focus
            error: null,
        };
    }

    /**
     * Sets up default interaction strategies for the accordion.
     * Includes strategies for toggling items and handling focus.
     */
    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('toggleItem', new AccordionToggleItemStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy()); // Group-level focus
    }

    /**
     * Updates the component's visual state (e.g., idle, focused, disabled)
     * based on its current data state.
     * @param stateData The current data state of the accordion.
     */
    updateCurrentStateBasedOnData(stateData: AccordionState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isFocused) this.transitionToState('focused');
        else this.transitionToState('idle');
    }

    /**
     * Gets the data attributes for the accordion element, reflecting its current state.
     * These attributes can be used for styling and accessibility.
     * @returns A record of data attributes.
     */
    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            'data-type': this.state.type,
            'data-collapsible': String(this.state.collapsible),
            ...(this.state.error && { 'data-error': 'true' }),
            'data-focused': String(this.state.isFocused), // For the accordion group
        };
    }

    // --- Public API methods ---

    /**
     * Toggles the open/closed state of an accordion item.
     * The behavior depends on the accordion's `type` and `collapsible` properties.
     * @param itemId The ID of the item to toggle.
     * @param itemDisabled Optional. Whether the specific item being interacted with is disabled.
     * @param originalEvent Optional. The original browser or React event that triggered this action.
     * @returns The result of the interaction.
     */
    toggleItem(itemId: string, itemDisabled?: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('toggleItem', { itemId, itemDisabled, originalEvent } as InteractionPayload & { itemId: string, itemDisabled?: boolean });
    }

    /**
     * Programmatically sets which accordion items are open.
     * @param openItems An array of item IDs to be open.
     */
    setOpenItems(openItems: string[]) {
        this.setState({ openItems });
    }

    /**
     * Sets the type of the accordion.
     * 'single': Only one item can be open at a time.
     * 'multiple': Multiple items can be open simultaneously.
     * If changing from 'multiple' to 'single' with multiple items open, only the first open item is preserved.
     * @param type The accordion type.
     */
    setType(type: 'single' | 'multiple') {
        if (type === 'single' && this.state.openItems.length > 1) {
            this.setState({ type, openItems: [this.state.openItems[0]] });
        } else {
            this.setState({ type });
        }
    }

    /**
     * Sets whether a single open item can be collapsed by clicking it again.
     * This only applies if `type` is 'single'.
     * @param collapsible True if the open item is collapsible, false otherwise.
     */
    setCollapsible(collapsible: boolean) {
        this.setState({ collapsible });
    }

    /**
     * Sets the disabled state of the entire accordion.
     * @param disabled True to disable the accordion, false to enable.
     */
    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }

    /**
     * Sets an error state for the accordion.
     * @param error The error object or message. Set to null to clear the error.
     */
    setError(error: any | null) {
        this.setState({ error: error });
    }

    /**
     * Sets the focus state of the accordion group.
     * @param isFocused True if the accordion group has focus, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent } as InteractionPayload & { isFocused: boolean });
    }
}

    