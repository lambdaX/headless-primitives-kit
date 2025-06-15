
import { HeadlessComponent, BaseComponentState } from './headless-component.ts';
import { TabsActivateTabStrategy, FocusStrategy, InteractionPayload } from './interaction-strategies.ts';

/**
 * Defines the state properties for a `HeadlessTabs` component.
 */
export interface TabsState extends BaseComponentState {
    /** The ID of the currently active tab, or null if no tab is active. */
    activeTab: string | null;
    /** The orientation of the tabs, either 'horizontal' or 'vertical'. */
    orientation: 'horizontal' | 'vertical';
    // isFocused here refers to the focus state of the tab list or a tab element.
}

/**
 * Manages the state and interactions for a tabs component.
 * Tabs allow users to switch between different views or sections of content.
 */
export class HeadlessTabs extends HeadlessComponent<TabsState> {
    /**
     * Defines the initial state for the tabs.
     * @returns The initial tabs state.
     */
    defineInitialState(): TabsState {
        return {
            activeTab: null,
            orientation: 'horizontal',
            isDisabled: false, // Disables the entire tabs group
            isFocused: false,  // Focus state for the tab list or an active tab
            error: null,
        };
    }

    /**
     * Sets up default interaction strategies for the tabs.
     */
    protected setupDefaultStrategies(): void {
        super.setupDefaultStrategies();
        this.interactionStrategies.set('activateTab', new TabsActivateTabStrategy());
        // Focus strategy could apply to the tab list or individual tab elements.
        // For simplicity, 'focus' here could mean the tab list has received focus,
        // or a specific tab element is focused.
        this.interactionStrategies.set('focus', new FocusStrategy()); 
    }

    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the tabs.
     */
    updateCurrentStateBasedOnData(stateData: TabsState): void {
        if (stateData.isDisabled) this.transitionToState('disabled');
        else if (stateData.error) this.transitionToState('error');
        else if (stateData.isFocused) this.transitionToState('focused'); // Tab list or active tab focus
        else this.transitionToState('idle');
    }

    /**
     * Gets the data attributes for the tabs container element.
     * @returns A record of data attributes.
     */
    getDataAttributes(): Record<string, string> {
        return {
            'data-disabled': String(this.state.isDisabled),
            'data-orientation': this.state.orientation,
            ...(this.state.activeTab && { 'data-active-tab': this.state.activeTab }),
            ...(this.state.error && { 'data-error': 'true' }),
            'data-focused': String(this.state.isFocused), // For the tabs container/list or active tab
        };
    }

    // --- Public API methods ---

    /**
     * Activates a tab by its ID.
     * Does nothing if the tabs group or the specific tab is disabled.
     * @param tabId The ID of the tab to activate.
     * @param tabDisabled Optional. Whether the specific tab being interacted with is disabled.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the activation interaction.
     */
    activateTab(tabId: string, tabDisabled?: boolean, originalEvent?: Event | React.SyntheticEvent) {
        if (this.state.isDisabled || tabDisabled) {
             return { prevented: true, reason: tabDisabled ? 'tab disabled' : 'group disabled' };
        }
        return this.handleInteraction('activateTab', { tabId, originalEvent } as InteractionPayload & { tabId: string });
    }

    /**
     * Programmatically sets the active tab.
     * Consider if `tabDisabled` logic from `activateTab` should also apply here if called directly.
     * For now, it directly sets the state.
     * @param activeTab The ID of the tab to set as active, or null to deactivate all.
     */
    setActiveTab(activeTab: string | null) {
        if (this.state.activeTab !== activeTab) {
             this.setState({ activeTab });
        }
    }

    /**
     * Sets the orientation of the tabs.
     * @param orientation 'horizontal' or 'vertical'.
     */
    setOrientation(orientation: 'horizontal' | 'vertical') {
        this.setState({ orientation });
    }

    /**
     * Sets the disabled state of the entire tabs group.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean) {
        this.setState({ isDisabled: disabled });
    }

    /**
     * Sets an error state for the tabs group.
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null) {
        this.setState({ error: error });
    }

    /**
     * Handles focus interaction, e.g., when the tab list or an individual tab receives focus.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent) {
        return this.handleInteraction('focus', { isFocused, originalEvent } as InteractionPayload & { isFocused: boolean });
    }
}

    
