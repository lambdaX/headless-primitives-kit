import { HeadlessComponent, BaseComponentState } from './headless-component';
/**
 * Defines the state properties for a `HeadlessButton` component.
 * Extends `BaseComponentState` which includes common states like isDisabled, isLoading, etc.
 */
export interface ButtonState extends BaseComponentState {
}
/**
 * Manages the state and interactions for a button component.
 * This class provides the logic for button behaviors like click, hover, focus,
 * disabled, loading, and error states, without dictating its appearance.
 */
export declare class HeadlessButton extends HeadlessComponent<ButtonState> {
    /**
     * Defines the initial state for the button.
     * @returns The initial button state.
     */
    defineInitialState(): ButtonState;
    /**
     * Sets up default interaction strategies for the button.
     * Includes strategies for click, hover, focus, and keyboard interactions.
     */
    protected setupDefaultStrategies(): void;
    /**
     * Updates the component's visual state (e.g., idle, pressed, disabled)
     * based on its current data state.
     * @param stateData The current data state of the button.
     */
    updateCurrentStateBasedOnData(stateData: ButtonState): void;
    /**
     * Gets the data attributes for the button element, reflecting its current state.
     * These attributes can be used for styling and accessibility.
     * @returns A record of data attributes (e.g., `data-disabled`, `data-loading`).
     */
    getDataAttributes(): Record<string, string>;
    /**
     * Simulates a click interaction on the button.
     * This will trigger the 'clicked' event if the button is not disabled or loading.
     * @param originalEvent Optional. The original browser or React event that triggered this action.
     * @returns The result of the click interaction.
     */
    click(originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the disabled state of the button.
     * @param disabled True to disable the button, false to enable.
     */
    setDisabled(disabled: boolean): void;
    /**
     * Sets the loading state of the button.
     * When loading, the button is typically non-interactive.
     * @param loading True to set the button to loading state, false otherwise.
     */
    setLoading(loading: boolean): void;
    /**
     * Sets an error state for the button.
     * @param error The error object or message. Set to null to clear the error.
     */
    setError(error: any | null): void;
    /**
     * Handles hover interaction.
     * @param isHovered True if the mouse is hovering over the button, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the hover interaction.
     */
    hover(isHovered: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Handles focus interaction.
     * @param isFocused True if the button has focus, false otherwise.
     * @param originalEvent Optional. The original browser or React event.
     * @returns The result of the focus interaction.
     */
    focus(isFocused: boolean, originalEvent?: Event | React.SyntheticEvent): import("./interaction-strategies").InteractionResult;
    /**
     * Sets the pressed state of the button (e.g., when mouse button is down).
     * @param isPressed True if the button is pressed, false otherwise.
     */
    press(isPressed: boolean): void;
    /**
     * Handles keyboard interaction, typically for 'Space' or 'Enter' keys to trigger a click.
     * @param originalEvent The `KeyboardEvent` from the browser.
     * @returns The result of the keyboard interaction.
     */
    keydown(originalEvent: KeyboardEvent): import("./interaction-strategies").InteractionResult;
}
//# sourceMappingURL=headless-button.d.ts.map