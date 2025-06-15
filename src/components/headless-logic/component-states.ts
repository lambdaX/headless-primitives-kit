import type { HeadlessComponent } from './headless-component';

export class ComponentState {
    constructor(public name: string, public component: HeadlessComponent<any>) {}
    
    enter(): void {
        // Override in subclasses for state entry logic
    }
    
    exit(): void {
        // Override in subclasses for state exit logic
    }
    
    getCSSClasses(): string[] {
        return [this.name];
    }
}

export class IdleState extends ComponentState {
    getCSSClasses(): string[] { return ['idle']; }
}

export class HoveredState extends ComponentState {
    getCSSClasses(): string[] { return ['hovered']; }
}

export class FocusedState extends ComponentState {
    getCSSClasses(): string[] { return ['focused']; }
}

export class PressedState extends ComponentState {
    getCSSClasses(): string[] { return ['pressed']; }
}

export class DisabledState extends ComponentState {
    getCSSClasses(): string[] { return ['disabled']; }
}

export class LoadingState extends ComponentState {
    getCSSClasses(): string[] { return ['loading']; }
}

export class ErrorState extends ComponentState {
    getCSSClasses(): string[] { return ['error']; }
}
