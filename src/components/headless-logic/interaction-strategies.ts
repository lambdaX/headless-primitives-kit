import type { HeadlessComponent, BaseComponentState } from './headless-component.ts';
import { HeadlessToggle } from './headless-toggle.ts';
import { HeadlessButton } from './headless-button.ts';
import { HeadlessCheckbox } from './headless-checkbox.ts';
import type { CheckboxState } from './headless-checkbox.ts';
import type { HeadlessInput, InputState } from './headless-input.ts';
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
export class InteractionStrategy {
    /**
     * Handles an interaction for a given component.
     * This method must be implemented by subclasses.
     * @param context The `HeadlessComponent` instance the interaction applies to.
     * @param payload Data associated with the interaction.
     * @returns An `InteractionResult` object.
     */
    handle(context: HeadlessComponent<any>, payload: InteractionPayload): InteractionResult {
        throw new Error('InteractionStrategy.handle() must be implemented by subclasses');
    }
}

/**
 * Strategy for handling click-like interactions that toggle an `isChecked` state.
 * Used by `HeadlessToggle` and `HeadlessCheckbox` (for non-indeterminate toggling).
 */
export class ToggleClickStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState & { isChecked: boolean }>, payload: InteractionPayload): InteractionResult {
        const state = context.getState();
        
        if (state.isDisabled || state.isLoading) {
            return { prevented: true, handled: false, reason: 'disabled or loading' };
        }
        
        const newCheckedState = !state.isChecked;
        context.setState({ isChecked: newCheckedState } as Partial<BaseComponentState & { isChecked: boolean }>);
        context.notifyObservers('toggled', { 
            checked: newCheckedState,
            originalEvent: payload.originalEvent 
        });
        
        return { prevented: false, handled: true };
    }
}

/**
 * Strategy for handling standard button click interactions.
 * Used by `HeadlessButton`.
 */
export class ButtonClickStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState>, payload: InteractionPayload): InteractionResult {
        const state = context.getState();
        
        if (state.isDisabled || state.isLoading) {
            return { prevented: true, handled: false, reason: 'disabled or loading' };
        }
        
        context.notifyObservers('clicked', { originalEvent: payload.originalEvent });
        
        return { prevented: false, handled: true };
    }
}

/**
 * Strategy for handling hover interactions (mouseenter, mouseleave).
 */
export class HoverStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState>, payload: InteractionPayload & { isHovered: boolean }): InteractionResult {
        const state = context.getState();
        
        // Allow visual hover state changes even if disabled, but don't trigger 'hoverChanged' event.
        // The primary purpose of isHovered in state is for visual feedback.
        if (state.isDisabled) {
            context.setState({ isHovered: payload.isHovered } as Partial<BaseComponentState>);
            return { prevented: false, handled: true, reason: 'disabled, visual hover only' };
        }
        
        if (state.isHovered !== payload.isHovered) {
            context.setState({ isHovered: payload.isHovered } as Partial<BaseComponentState>);
            context.notifyObservers('hoverChanged', { 
                isHovered: payload.isHovered,
                originalEvent: payload.originalEvent 
            });
        }
        
        return { prevented: false, handled: true };
    }
}

/**
 * Strategy for handling focus and blur interactions.
 */
export class FocusStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState>, payload: InteractionPayload & { isFocused: boolean }): InteractionResult {
        const state = context.getState();
        
        if (state.isDisabled && payload.isFocused) {
            // Do not allow focus if component is disabled
            return { prevented: true, handled: false, reason: 'disabled' };
        }
        
        if (state.isFocused !== payload.isFocused) {
            context.setState({ isFocused: payload.isFocused } as Partial<BaseComponentState>);
            context.notifyObservers('focusChanged', { 
                isFocused: payload.isFocused,
                originalEvent: payload.originalEvent 
            });
        }
        
        return { prevented: false, handled: true };
    }
}

/**
 * Strategy for handling keyboard interactions, typically Space and Enter keys
 * to activate components like buttons, toggles, and checkboxes.
 */
export class KeyboardStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState & { isChecked?: boolean }>, payload: InteractionPayload & { key: string; originalEvent: KeyboardEvent }): InteractionResult {
        const { key, originalEvent } = payload;
        const state = context.getState();
        
        if (state.isDisabled || state.isLoading) {
            return { prevented: true, handled: false, reason: 'disabled or loading' };
        }
        
        if (key === ' ' || key === 'Enter') {
            originalEvent.preventDefault(); // Prevent default browser action (e.g., scrolling on Space)
            
            // Handle components with an 'isChecked' property (Toggles, Checkboxes)
            if ('isChecked' in state && (context instanceof HeadlessToggle || context instanceof HeadlessCheckbox)) {
                const checkboxContext = context as HeadlessCheckbox; // Type assertion for checkbox-specific logic
                const currentChecked = (state as { isChecked: boolean }).isChecked;
                const currentIndeterminate = (checkboxContext instanceof HeadlessCheckbox) && (state as CheckboxState).isIndeterminate;

                if (currentIndeterminate && checkboxContext instanceof HeadlessCheckbox) {
                     // If indeterminate, Space/Enter usually makes it checked
                     checkboxContext.setState({ isChecked: true, isIndeterminate: false } as Partial<CheckboxState>);
                     checkboxContext.notifyObservers('toggled', { 
                        checked: true,
                        fromIndeterminate: true,
                        triggeredBy: 'keyboard',
                        key: key,
                        originalEvent: originalEvent 
                    });
                } else {
                    // Standard toggle for non-indeterminate or HeadlessToggle
                    const newCheckedState = !currentChecked;
                    context.setState({ isChecked: newCheckedState } as Partial<BaseComponentState & { isChecked: boolean }>);
                    context.notifyObservers('toggled', { 
                        checked: newCheckedState,
                        triggeredBy: 'keyboard',
                        key: key,
                        originalEvent: originalEvent 
                    });
                }

            } else if (context instanceof HeadlessButton) {
                // For buttons, Space/Enter triggers a click
                context.notifyObservers('clicked', { 
                    triggeredBy: 'keyboard',
                    key: key,
                    originalEvent: originalEvent 
                });
            }
            return { prevented: false, handled: true };
        }
        
        return { prevented: false, handled: false }; // Not handled by this key
    }
}

/**
 * Strategy for handling text input changes in an input field.
 * Used by `HeadlessInput`.
 */
export class InputTextStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<InputState>, payload: InteractionPayload & { value: string }): InteractionResult {
        const state = context.getState();
        
        if (state.isDisabled || state.isReadOnly) {
            return { prevented: true, handled: false, reason: 'disabled or readOnly' };
        }
        
        const oldValue = state.value;
        const newValue = payload.value;
        
        if (oldValue !== newValue) {
            context.setState({ value: newValue }); 
            context.notifyObservers('valueChanged', { 
                oldValue: oldValue,
                newValue: newValue,
                originalEvent: payload.originalEvent 
            });
        }
        
        return { prevented: false, handled: true };
    }
}

/**
 * Strategy for selecting an item in a `HeadlessRadioGroup`.
 */
export class RadioItemSelectStrategy extends InteractionStrategy {
    handle(context: HeadlessRadioGroup, payload: InteractionPayload & { value: string }): InteractionResult {
        const state = context.getState();
        if (state.isDisabled) { // Group disabled
            return { prevented: true, handled: false, reason: 'group disabled' };
        }

        const selectedOption = state.options.find(opt => opt.value === payload.value);
        if (!selectedOption || selectedOption.disabled) { // Option not found or specific option disabled
            return { prevented: true, handled: false, reason: 'option not found or disabled' };
        }

        if (state.value !== payload.value) {
            context.setState({ value: payload.value });
            context.notifyObservers('valueChanged', {
                value: payload.value,
                originalEvent: payload.originalEvent,
            });
        }
        return { prevented: false, handled: true };
    }
}

/**
 * Strategy for updating the value of a `HeadlessSlider`, typically via dragging or direct manipulation.
 * Ensures the value is clamped to min/max and adheres to the step.
 */
export class SliderUpdateStrategy extends InteractionStrategy {
    handle(context: HeadlessSlider, payload: InteractionPayload & { value: number }): InteractionResult {
        const state = context.getState();
        if (state.isDisabled) {
            return { prevented: true, handled: false, reason: 'disabled' };
        }

        let newValue = payload.value;
        // Clamp value to min/max
        newValue = Math.max(state.min, Math.min(state.max, newValue));
        // Adhere to step, ensuring correct alignment with min
        newValue = Math.round((newValue - state.min) / state.step) * state.step + state.min;
        // Clamp again after step adjustment to be safe
        newValue = Math.max(state.min, Math.min(state.max, newValue));


        if (state.value !== newValue) {
            context.setState({ value: newValue });
            context.notifyObservers('valueChanged', {
                value: newValue,
                originalEvent: payload.originalEvent,
            });
        }
        return { prevented: false, handled: true };
    }
}

/**
 * Strategy for handling keyboard interactions on a `HeadlessSlider`
 * (e.g., Arrow keys, Home, End).
 */
export class SliderKeyboardStrategy extends InteractionStrategy {
    handle(context: HeadlessSlider, payload: InteractionPayload & { key: string; originalEvent: KeyboardEvent }): InteractionResult {
        const { key, originalEvent } = payload;
        const state = context.getState();

        if (state.isDisabled) {
            return { prevented: true, handled: false, reason: 'disabled' };
        }

        let handled = false;
        let newValue = state.value;
        const step = state.step; // Assuming step is always positive
        // Consider larger step for PageUp/PageDown if desired (e.g., 10 * step)

        switch (key) {
            case 'ArrowLeft':
            case 'ArrowDown': // For vertical sliders, though this example is horizontal
                newValue = state.value - step;
                handled = true;
                break;
            case 'ArrowRight':
            case 'ArrowUp': // For vertical sliders
                newValue = state.value + step;
                handled = true;
                break;
            case 'Home':
                newValue = state.min;
                handled = true;
                break;
            case 'End':
                newValue = state.max;
                handled = true;
                break;
        }

        if (handled) {
            originalEvent.preventDefault();
            // Clamp and step value (delegating to the same logic as SliderUpdateStrategy essentially)
            newValue = Math.max(state.min, Math.min(state.max, newValue));
            newValue = Math.round((newValue - state.min) / step) * step + state.min;
            newValue = Math.max(state.min, Math.min(state.max, newValue)); // Clamp again


            if (state.value !== newValue) {
                context.setState({ value: newValue });
                context.notifyObservers('valueChanged', {
                    value: newValue,
                    triggeredBy: 'keyboard',
                    key: key,
                    originalEvent: originalEvent,
                });
            }
            return { prevented: false, handled: true };
        }

        return { prevented: false, handled: false }; // Key not handled by this strategy
    }
}

/**
 * Strategy for toggling an item in a `HeadlessAccordion`.
 * Considers accordion type (single/multiple) and collapsibility.
 */
export class AccordionToggleItemStrategy extends InteractionStrategy {
    handle(context: HeadlessAccordion, payload: InteractionPayload & { itemId: string; itemDisabled?: boolean }): InteractionResult {
        const state = context.getState();
        const { itemId, itemDisabled } = payload;

        if (state.isDisabled || itemDisabled) { // Group or specific item disabled
            return { prevented: true, handled: false, reason: itemDisabled ? 'item disabled' : 'group disabled' };
        }

        let newOpenItems = [...state.openItems];
        const isOpen = newOpenItems.includes(itemId);

        if (state.type === 'single') {
            if (isOpen) {
                if (state.collapsible) {
                    newOpenItems = []; // Close the item
                }
                // If not collapsible and already open, do nothing, so no state change.
            } else {
                newOpenItems = [itemId]; // Open this item, implies closing others for 'single' type
            }
        } else { // type === 'multiple'
            if (isOpen) {
                newOpenItems = newOpenItems.filter(id => id !== itemId); // Close the item
            } else {
                newOpenItems.push(itemId); // Open the item, add to existing open items
            }
        }

        // Only update state and notify if there's an actual change in open items
        if (JSON.stringify(state.openItems) !== JSON.stringify(newOpenItems)) {
            context.setState({ openItems: newOpenItems });
            context.notifyObservers('itemToggled', {
                itemId,
                isOpen: newOpenItems.includes(itemId), // The new state of the item being toggled
                openItems: newOpenItems, // The complete list of open items
                originalEvent: payload.originalEvent,
            });
        }
        
        return { prevented: false, handled: true };
    }
}

/**
 * Strategy for activating a tab in a `HeadlessTabs` component.
 */
export class TabsActivateTabStrategy extends InteractionStrategy {
    handle(context: HeadlessTabs, payload: InteractionPayload & { tabId: string; tabDisabled?: boolean }): InteractionResult {
        const state = context.getState();
        const { tabId, tabDisabled } = payload; // `tabDisabled` could be passed if individual tabs can be disabled

        if (state.isDisabled || tabDisabled) { // Group or specific tab disabled
            return { prevented: true, handled: false, reason: tabDisabled ? 'tab disabled' : 'group disabled' };
        }

        if (state.activeTab !== tabId) {
            context.setState({ activeTab: tabId });
            context.notifyObservers('tabActivated', {
                tabId,
                originalEvent: payload.originalEvent,
            });
        }
        
        return { prevented: false, handled: true };
    }
}
