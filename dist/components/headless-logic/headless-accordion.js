import { HeadlessComponent } from './headless-component';
import { AccordionToggleItemStrategy, FocusStrategy } from './interaction-strategies';
/**
 * Manages the state and interactions for an accordion component.
 * An accordion allows users to toggle the visibility of content sections.
 */
export class HeadlessAccordion extends HeadlessComponent {
    /**
     * Defines the initial state for the accordion.
     * @returns The initial accordion state.
     */
    defineInitialState() {
        return {
            openItems: [],
            type: 'single',
            collapsible: false,
            isDisabled: false,
            isFocused: false,
            error: null,
        };
    }
    /**
     * Sets up default interaction strategies for the accordion.
     * Includes strategies for toggling items and handling focus.
     */
    setupDefaultStrategies() {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('toggleItem', new AccordionToggleItemStrategy());
        this.interactionStrategies.set('focus', new FocusStrategy()); // Group-level focus
    }
    /**
     * Updates the component's visual state (e.g., idle, focused, disabled)
     * based on its current data state.
     * @param stateData The current data state of the accordion.
     */
    updateCurrentStateBasedOnData(stateData) {
        if (stateData.isDisabled)
            this.transitionToState('disabled');
        else if (stateData.error)
            this.transitionToState('error');
        else if (stateData.isFocused)
            this.transitionToState('focused');
        else
            this.transitionToState('idle');
    }
    /**
     * Gets the data attributes for the accordion element, reflecting its current state.
     * These attributes can be used for styling and accessibility.
     * @returns A record of data attributes.
     */
    getDataAttributes() {
        return Object.assign(Object.assign({ 'data-disabled': String(this.state.isDisabled), 'data-type': this.state.type, 'data-collapsible': String(this.state.collapsible) }, (this.state.error && { 'data-error': 'true' })), { 'data-focused': String(this.state.isFocused) });
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
    toggleItem(itemId, itemDisabled, originalEvent) {
        return this.handleInteraction('toggleItem', { itemId, itemDisabled, originalEvent });
    }
    /**
     * Programmatically sets which accordion items are open.
     * @param openItems An array of item IDs to be open.
     */
    setOpenItems(openItems) {
        this.setState({ openItems });
    }
    /**
     * Sets the type of the accordion.
     * 'single': Only one item can be open at a time.
     * 'multiple': Multiple items can be open simultaneously.
     * If changing from 'multiple' to 'single' with multiple items open, only the first open item is preserved.
     * @param type The accordion type.
     */
    setType(type) {
        if (type === 'single' && this.state.openItems.length > 1) {
            this.setState({ type, openItems: [this.state.openItems[0]] });
        }
        else {
            this.setState({ type });
        }
    }
    /**
     * Sets whether a single open item can be collapsed by clicking it again.
     * This only applies if `type` is 'single'.
     * @param collapsible True if the open item is collapsible, false otherwise.
     */
    setCollapsible(collapsible) {
        this.setState({ collapsible });
    }
    /**
     * Sets the disabled state of the entire accordion.
     * @param disabled True to disable the accordion, false to enable.
     */
    setDisabled(disabled) {
        this.setState({ isDisabled: disabled });
    }
    /**
     * Sets an error state for the accordion.
     * @param error The error object or message. Set to null to clear the error.
     */
    setError(error) {
        this.setState({ error: error });
    }
    /**
     * Sets the focus state of the accordion group.
     * @param isFocused True if the accordion group has focus, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused, originalEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent });
    }
}
//# sourceMappingURL=headless-accordion.js.map