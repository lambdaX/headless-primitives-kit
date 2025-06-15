
import type { HeadlessComponent, BaseComponentState } from './headless-component';
import type { HeadlessToggle, ToggleState } from './headless-toggle';
import type { HeadlessButton } from './headless-button';
import type { HeadlessInput, InputState } from './headless-input';
import type { HeadlessCheckbox, CheckboxState } from './headless-checkbox';
import type { HeadlessRadioGroup, RadioGroupState } from './headless-radio-group';
import type { HeadlessSlider, SliderState } from './headless-slider';
import type { HeadlessAccordion, AccordionState } from './headless-accordion';
import type { HeadlessTabs, TabsState } from './headless-tabs';


export interface InteractionPayload {
    originalEvent?: Event | React.SyntheticEvent;
    [key: string]: any;
}

export interface InteractionResult {
    prevented: boolean;
    reason?: string;
    handled?: boolean;
}

export class InteractionStrategy {
    handle(context: HeadlessComponent<any>, payload: InteractionPayload): InteractionResult {
        throw new Error('InteractionStrategy.handle() must be implemented by subclasses');
    }
}

export class ToggleClickStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState & { isChecked: boolean }>, payload: InteractionPayload): InteractionResult {
        const state = context.getState();
        
        if (state.isDisabled || state.isLoading) {
            return { prevented: true, reason: 'disabled or loading' };
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

export class ButtonClickStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState>, payload: InteractionPayload): InteractionResult {
        const state = context.getState();
        
        if (state.isDisabled || state.isLoading) {
            return { prevented: true, reason: 'disabled or loading' };
        }
        
        context.notifyObservers('clicked', { originalEvent: payload.originalEvent });
        
        return { prevented: false, handled: true };
    }
}

export class HoverStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState>, payload: InteractionPayload & { isHovered: boolean }): InteractionResult {
        const state = context.getState();
        
        if (state.isDisabled) {
             // Allow hover state changes even if disabled, for visual feedback, but don't notify typical 'hover' event.
            context.setState({ isHovered: payload.isHovered } as Partial<BaseComponentState>);
            return { prevented: false, handled: true, reason: 'disabled, visual hover only' };
        }
        
        context.setState({ isHovered: payload.isHovered } as Partial<BaseComponentState>);
        context.notifyObservers('hoverChanged', { 
            isHovered: payload.isHovered,
            originalEvent: payload.originalEvent 
        });
        
        return { prevented: false, handled: true };
    }
}

export class FocusStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState>, payload: InteractionPayload & { isFocused: boolean }): InteractionResult {
        const state = context.getState();
        
        if (state.isDisabled) {
            // Do not allow focus if disabled
            return { prevented: true, reason: 'disabled' };
        }
        
        context.setState({ isFocused: payload.isFocused } as Partial<BaseComponentState>);
        context.notifyObservers('focusChanged', { 
            isFocused: payload.isFocused,
            originalEvent: payload.originalEvent 
        });
        
        return { prevented: false, handled: true };
    }
}

export class KeyboardStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<BaseComponentState & { isChecked?: boolean }>, payload: InteractionPayload & { key: string; originalEvent: KeyboardEvent }): InteractionResult {
        const { key, originalEvent } = payload;
        const state = context.getState();
        
        if (state.isDisabled || state.isLoading) {
            return { prevented: true, reason: 'disabled or loading' };
        }
        
        if (key === ' ' || key === 'Enter') {
            originalEvent.preventDefault();
            if ('isChecked' in state && (context instanceof HeadlessToggle || context instanceof HeadlessCheckbox)) {
                // Assuming isChecked is a boolean. This might need adjustment if Checkbox has indeterminate state handling here.
                const currentChecked = (state as { isChecked: boolean }).isChecked;
                const currentIndeterminate = (context instanceof HeadlessCheckbox) && (state as CheckboxState).isIndeterminate;

                if (currentIndeterminate && context instanceof HeadlessCheckbox) {
                     context.setState({ isChecked: true, isIndeterminate: false } as Partial<CheckboxState>);
                     context.notifyObservers('toggled', { 
                        checked: true,
                        fromIndeterminate: true,
                        triggeredBy: 'keyboard',
                        key: key,
                        originalEvent: originalEvent 
                    });
                } else {
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
                context.notifyObservers('clicked', { 
                    triggeredBy: 'keyboard',
                    key: key,
                    originalEvent: originalEvent 
                });
            }
            return { prevented: false, handled: true };
        }
        
        return { prevented: false, handled: false };
    }
}

export class InputTextStrategy extends InteractionStrategy {
    handle(context: HeadlessComponent<InputState>, payload: InteractionPayload & { value: string }): InteractionResult {
        const state = context.getState();
        
        if (state.isDisabled || state.isReadOnly) {
            return { prevented: true, reason: 'disabled or readOnly' };
        }
        
        const oldValue = state.value;
        const newValue = payload.value;
        
        if (oldValue !== newValue) {
            context.setState({ value: newValue }); // Assuming validation happens elsewhere or is reflected in 'isValid'/'error' later
            context.notifyObservers('valueChanged', { 
                oldValue: oldValue,
                newValue: newValue,
                originalEvent: payload.originalEvent 
            });
        }
        
        return { prevented: false, handled: true };
    }
}


export class RadioItemSelectStrategy extends InteractionStrategy {
    handle(context: HeadlessRadioGroup, payload: InteractionPayload & { value: string }): InteractionResult {
        const state = context.getState();
        if (state.isDisabled) {
            return { prevented: true, reason: 'disabled' };
        }

        const selectedOption = state.options.find(opt => opt.value === payload.value);
        if (!selectedOption || selectedOption.disabled) {
            return { prevented: true, reason: 'option not found or disabled' };
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

export class SliderUpdateStrategy extends InteractionStrategy {
    handle(context: HeadlessSlider, payload: InteractionPayload & { value: number }): InteractionResult {
        const state = context.getState();
        if (state.isDisabled) {
            return { prevented: true, reason: 'disabled' };
        }

        let newValue = payload.value;
        // Clamp value
        newValue = Math.max(state.min, Math.min(state.max, newValue));
        // Adhere to step
        newValue = Math.round((newValue - state.min) / state.step) * state.step + state.min;
        // Ensure it's clamped again after step adjustment
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

export class SliderKeyboardStrategy extends InteractionStrategy {
    handle(context: HeadlessSlider, payload: InteractionPayload & { key: string; originalEvent: KeyboardEvent }): InteractionResult {
        const { key, originalEvent } = payload;
        const state = context.getState();

        if (state.isDisabled) {
            return { prevented: true, reason: 'disabled' };
        }

        let handled = false;
        let newValue = state.value;

        switch (key) {
            case 'ArrowLeft':
            case 'ArrowDown':
                newValue = state.value - state.step;
                handled = true;
                break;
            case 'ArrowRight':
            case 'ArrowUp':
                newValue = state.value + state.step;
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
            // Clamp and step value
            newValue = Math.max(state.min, Math.min(state.max, newValue));
            newValue = Math.round((newValue - state.min) / state.step) * state.step + state.min;
            newValue = Math.max(state.min, Math.min(state.max, newValue));


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

        return { prevented: false, handled: false };
    }
}


export class AccordionToggleItemStrategy extends InteractionStrategy {
    handle(context: HeadlessAccordion, payload: InteractionPayload & { itemId: string; itemDisabled?: boolean }): InteractionResult {
        const state = context.getState();
        const { itemId, itemDisabled } = payload;

        if (state.isDisabled || itemDisabled) {
            return { prevented: true, reason: itemDisabled ? 'item disabled' : 'group disabled' };
        }

        let newOpenItems = [...state.openItems];
        const isOpen = newOpenItems.includes(itemId);

        if (state.type === 'single') {
            if (isOpen) {
                if (state.collapsible) {
                    newOpenItems = []; // Close the item
                }
                // If not collapsible and already open, do nothing
            } else {
                newOpenItems = [itemId]; // Open the item, close others
            }
        } else { // type === 'multiple'
            if (isOpen) {
                newOpenItems = newOpenItems.filter(id => id !== itemId); // Close the item
            } else {
                newOpenItems.push(itemId); // Open the item
            }
        }

        if (JSON.stringify(state.openItems) !== JSON.stringify(newOpenItems)) {
            context.setState({ openItems: newOpenItems });
            context.notifyObservers('itemToggled', {
                itemId,
                isOpen: newOpenItems.includes(itemId),
                openItems: newOpenItems,
                originalEvent: payload.originalEvent,
            });
        }
        
        return { prevented: false, handled: true };
    }
}

export class TabsActivateTabStrategy extends InteractionStrategy {
    handle(context: HeadlessTabs, payload: InteractionPayload & { tabId: string; tabDisabled?: boolean }): InteractionResult {
        const state = context.getState();
        const { tabId, tabDisabled } = payload;

        if (state.isDisabled || tabDisabled) {
            return { prevented: true, reason: tabDisabled ? 'tab disabled' : 'group disabled' };
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
