import type { HeadlessComponent, BaseComponentState } from './headless-component';
import type { HeadlessToggle, ToggleState } from './headless-toggle';
import type { HeadlessButton } from './headless-button';
import type { HeadlessInput, InputState } from './headless-input';
import type { HeadlessCheckbox, CheckboxState } from './headless-checkbox';

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
            return { prevented: true, reason: 'disabled' };
        }
        
        context.setState({ isHovered: payload.isHovered } as Partial<BaseComponentState>);
        context.notifyObservers('hover', { 
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
            return { prevented: true, reason: 'disabled' };
        }
        
        context.setState({ isFocused: payload.isFocused } as Partial<BaseComponentState>);
        context.notifyObservers('focus', { 
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
                const newCheckedState = !state.isChecked;
                context.setState({ isChecked: newCheckedState } as Partial<BaseComponentState & { isChecked: boolean }>);
                context.notifyObservers('toggled', { 
                    checked: newCheckedState,
                    triggeredBy: 'keyboard',
                    key: key,
                    originalEvent: originalEvent 
                });
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
