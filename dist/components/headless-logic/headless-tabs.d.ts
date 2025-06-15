import { HeadlessComponent, BaseComponentState } from './headless-component.ts';
/**
 * Defines the state properties for a `HeadlessTabs` component.
 */
export interface TabsState extends BaseComponentState {
    /** The ID of the currently active tab, or null if no tab is active. */
    activeTab: string | null;
    /** The orientation of the tabs, either 'horizontal' or 'vertical'. */
    orientation: 'horizontal' | 'vertical';
}
/**
 * Manages the state and interactions for a tabs component.
 * Tabs allow users to switch between different views or sections of content.
 */
export declare class HeadlessTabs extends HeadlessComponent<TabsState> {
    /**
     * Defines the initial state for the tabs.
     * @returns The initial tabs state.
     */
    defineInitialState(): TabsState;
    /**
     * Sets up default interaction strategies for the tabs.
     */
    protected setupDefaultStrategies(): void;
    /**
     * Updates the component's visual state based on its current data state.
     * @param stateData The current data state of the tabs.
     */
    updateCurrentStateBasedOnData(stateData: TabsState): void;
    /**
     * Gets the data attributes for the tabs container element.
     * @returns A record of data attributes.
     */
    getDataAttributes(): Record<string, string>;
    /**
     * Activates a tab by its ID.
     * Does nothing if the tabs group or the specific tab is disabled.
     * @param tabId The ID of the tab to activate.
     * @param tabDisabled Optional. Whether the specific tab being interacted with is disabled.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the activation interaction.
     */
    activateTab(tabId: string, tabDisabled?: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies.ts").InteractionResult;
    /**
     * Programmatically sets the active tab.
     * Consider if `tabDisabled` logic from `activateTab` should also apply here if called directly.
     * For now, it directly sets the state.
     * @param activeTab The ID of the tab to set as active, or null to deactivate all.
     */
    setActiveTab(activeTab: string | null): void;
    /**
     * Sets the orientation of the tabs.
     * @param orientation 'horizontal' or 'vertical'.
     */
    setOrientation(orientation: 'horizontal' | 'vertical'): void;
    /**
     * Sets the disabled state of the entire tabs group.
     * @param disabled True to disable, false to enable.
     */
    setDisabled(disabled: boolean): void;
    /**
     * Sets an error state for the tabs group.
     * @param error The error object or message. Null to clear.
     */
    setError(error: any | null): void;
    /**
     * Handles focus interaction, e.g., when the tab list or an individual tab receives focus.
     * @param isFocused True if focused, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies.ts").InteractionResult;
}
//# sourceMappingURL=headless-tabs.d.ts.map