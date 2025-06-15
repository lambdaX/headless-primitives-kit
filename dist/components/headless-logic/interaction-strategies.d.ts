import type { HeadlessComponent, BaseComponentState } from './headless-component.ts';
import type { InputState } from './headless-input.ts';
import type { HeadlessRadioGroup } from './headless-radio-group.ts';
import type { HeadlessSlider } from './headless-slider.ts';
import type { HeadlessAccordion } from './headless-accordion.ts';
import type { HeadlessTabs } from './headless-tabs.ts';
/**
 * Defines the structure for data passed to an interaction strategy.
 * @property originalEvent Optional. The original browser or React event that triggered the interaction.
 * @property [key: string] Allows for additional arbitrary data.
 */
export interface InteractionPayload {
    originalEvent?: Event | React.SyntheticEvent;
    [key: string]: any;
}
/**
 * Defines the result of an interaction strategy's handling.
 * @property prevented True if the default action or further processing should be prevented.
 * @property reason Optional. A string explaining why the interaction was prevented.
 * @property handled Optional. True if the strategy successfully handled the interaction.
 */
export interface InteractionResult {
    prevented: boolean;
    reason?: string;
    handled?: boolean;
}
/**
 * Base class for all interaction strategies.
 * Interaction strategies define how a `HeadlessComponent` reacts to specific user inputs or events.
 */
export declare class InteractionStrategy {
    /**
     * Handles an interaction for a given component.
     * This method must be implemented by subclasses.
     * @param context The `HeadlessComponent` instance the interaction applies to.
     * @param payload Data associated with the interaction.
     * @returns An `InteractionResult` object.
     */
    handle(context: HeadlessComponent<any>, payload: InteractionPayload): InteractionResult;
}
/**
 * Strategy for handling click-like interactions that toggle an `isChecked` state.
 * Used by `HeadlessToggle` and `HeadlessCheckbox` (for non-indeterminate toggling).
 */
export declare class ToggleClickStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState & {
        isChecked: boolean;
    }>, payload: InteractionPayload): InteractionResult;
}
/**
 * Strategy for handling standard button click interactions.
 * Used by `HeadlessButton`.
 */
export declare class ButtonClickStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState>, payload: InteractionPayload): InteractionResult;
}
/**
 * Strategy for handling hover interactions (mouseenter, mouseleave).
 */
export declare class HoverStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState>, payload: InteractionPayload & {
        isHovered: boolean;
    }): InteractionResult;
}
/**
 * Strategy for handling focus and blur interactions.
 */
export declare class FocusStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState>, payload: InteractionPayload & {
        isFocused: boolean;
    }): InteractionResult;
}
/**
 * Strategy for handling keyboard interactions, typically Space and Enter keys
 * to activate components like buttons, toggles, and checkboxes.
 */
export declare class KeyboardStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState & {
        isChecked?: boolean;
    }>, payload: InteractionPayload & {
        key: string;
        originalEvent: KeyboardEvent;
    }): InteractionResult;
}
/**
 * Strategy for handling text input changes in an input field.
 * Used by `HeadlessInput`.
 */
export declare class InputTextStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<InputState>, payload: InteractionPayload & {
        value: string;
    }): InteractionResult;
}
/**
 * Strategy for selecting an item in a `HeadlessRadioGroup`.
 */
export declare class RadioItemSelectStrategy extends InteractionStrategy {
    handle(context: HeadlessRadioGroup, payload: InteractionPayload & {
        value: string;
    }): InteractionResult;
}
/**
 * Strategy for updating the value of a `HeadlessSlider`, typically via dragging or direct manipulation.
 * Ensures the value is clamped to min/max and adheres to the step.
 */
export declare class SliderUpdateStrategy extends InteractionStrategy {
    handle(context: HeadlessSlider, payload: InteractionPayload & {
        value: number;
    }): InteractionResult;
}
/**
 * Strategy for handling keyboard interactions on a `HeadlessSlider`
 * (e.g., Arrow keys, Home, End).
 */
export declare class SliderKeyboardStrategy extends InteractionStrategy {
    handle(context: HeadlessSlider, payload: InteractionPayload & {
        key: string;
        originalEvent: KeyboardEvent;
    }): InteractionResult;
}
/**
 * Strategy for toggling an item in a `HeadlessAccordion`.
 * Considers accordion type (single/multiple) and collapsibility.
 */
export declare class AccordionToggleItemStrategy extends InteractionStrategy {
    handle(context: HeadlessAccordion, payload: InteractionPayload & {
        itemId: string;
        itemDisabled?: boolean;
    }): InteractionResult;
}
/**
 * Strategy for activating a tab in a `HeadlessTabs` component.
 */
export declare class TabsActivateTabStrategy extends InteractionStrategy {
    handle(context: HeadlessTabs, payload: InteractionPayload & {
        tabId: string;
        tabDisabled?: boolean;
    }): InteractionResult;
}
//# sourceMappingURL=interaction-strategies.d.ts.map