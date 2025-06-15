'use client';

import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch'; // ShadCN switch for boolean controls
import { Input as ShadcnInput } from '@/components/ui/input'; // ShadCN input for text controls
import { useHeadlessComponent } from '@/hooks/use-headless-component';
import type { HeadlessComponent, BaseComponentState } from '@/components/headless-logic';
import { ComponentInspector } from './component-inspector';
import { UndoRedoControls } from './undo-redo-controls';
import { cn } from '@/lib/utils';

// Import specific headless components for type inference and method access
import { HeadlessToggle, ToggleState } from '@/components/headless-logic/headless-toggle';
import { HeadlessButton, ButtonState } from '@/components/headless-logic/headless-button';
import { HeadlessInput, InputState } from '@/components/headless-logic/headless-input';
import { HeadlessCheckbox, CheckboxState } from '@/components/headless-logic/headless-checkbox';

import { AlertTriangle, Ban, CheckIcon, Loader2, Minus } from 'lucide-react';

type SupportedHeadlessComponent = HeadlessToggle | HeadlessButton | HeadlessInput | HeadlessCheckbox;
type SupportedHeadlessState = ToggleState | ButtonState | InputState | CheckboxState;

interface InteractiveComponentWrapperProps<
  TComp extends SupportedHeadlessComponent,
  TState extends SupportedHeadlessState
> {
  componentType: new () => TComp;
  renderComponent: (
    component: TComp,
    componentState: TState,
    cssStateClasses: string[],
    dataAttributes: Record<string, string>
  ) => React.ReactNode;
  title: string;
  description?: string;
  initialStateOverrides?: Partial<TState>;
}

export function InteractiveComponentWrapper<
  TComp extends SupportedHeadlessComponent,
  TState extends SupportedHeadlessState
>({
  componentType,
  renderComponent,
  title,
  description,
  initialStateOverrides,
}: InteractiveComponentWrapperProps<TComp, TState>) {
  
  const { component, componentState, cssState, history, undo, redo } = 
    useHeadlessComponent(componentType as new () => TComp);

  // Apply initial state overrides once after component instantiation
  useMemo(() => {
    if (initialStateOverrides) {
      // This uses setState which creates a command. If this should not be undoable,
      // a direct state manipulation before first notification might be needed,
      // or a special `initializeState` method on HeadlessComponent.
      // For a playground, having it in history might be acceptable.
      component.setState(initialStateOverrides as Partial<BaseComponentState>);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, initialStateOverrides]); // component ensures this runs once per instance

  const commonControls = (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id={`${title}-disabled`}
          checked={!!componentState.isDisabled}
          onCheckedChange={(checked) => component.setState({ isDisabled: checked })}
          aria-labelledby={`${title}-disabled-label`}
        />
        <Label htmlFor={`${title}-disabled`} id={`${title}-disabled-label`}>Disabled</Label>
      </div>
      {'isLoading' in componentState && (
        <div className="flex items-center space-x-2">
          <Switch
            id={`${title}-loading`}
            checked={!!componentState.isLoading}
            onCheckedChange={(checked) => component.setState({ isLoading: checked } as Partial<BaseComponentState>)}
            aria-labelledby={`${title}-loading-label`}
          />
          <Label htmlFor={`${title}-loading`} id={`${title}-loading-label`}>Loading</Label>
        </div>
      )}
      <div className="flex items-center space-x-2">
         <Switch
            id={`${title}-error`}
            checked={!!componentState.error}
            onCheckedChange={(checked) => component.setState({ error: checked ? 'Sample Error' : null })}
            aria-labelledby={`${title}-error-label`}
          />
        <Label htmlFor={`${title}-error`} id={`${title}-error-label`}>Error</Label>
      </div>
    </>
  );

  let specificControls = null;
  if (component instanceof HeadlessInput) {
    specificControls = (
      <div className="flex items-center space-x-2">
        <Switch
          id={`${title}-readonly`}
          checked={!!(componentState as InputState).isReadOnly}
          onCheckedChange={(checked) => (component as HeadlessInput).setReadOnly(checked)}
          aria-labelledby={`${title}-readonly-label`}
        />
        <Label htmlFor={`${title}-readonly`} id={`${title}-readonly-label`}>Read-only</Label>
      </div>
    );
  } else if (component instanceof HeadlessCheckbox) {
     specificControls = (
      <div className="flex items-center space-x-2">
        <Switch
          id={`${title}-indeterminate`}
          checked={!!(componentState as CheckboxState).isIndeterminate}
          onCheckedChange={(checked) => (component as HeadlessCheckbox).setIndeterminate(checked)}
          aria-labelledby={`${title}-indeterminate-label`}
        />
        <Label htmlFor={`${title}-indeterminate`} id={`${title}-indeterminate-label`}>Indeterminate</Label>
      </div>
    );
  }


  return (
    <Card className="w-full shadow-xl overflow-hidden">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 border rounded-lg bg-background flex items-center justify-center min-h-[100px] transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
          {renderComponent(component, componentState as TState, cssState.classes, cssState.dataAttributes)}
        </div>
        
        <div className="space-y-3 p-4 border rounded-md bg-card/50">
          <h4 className="font-semibold text-md text-foreground/80">State Controls:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {commonControls}
            {specificControls}
          </div>
        </div>

        <UndoRedoControls undo={undo} redo={redo} history={history} />
        <ComponentInspector componentInstance={component} componentState={componentState} cssState={cssState} />
      </CardContent>
    </Card>
  );
}


// Example UI Renderers for each component type

export const ToggleRenderer: InteractiveComponentWrapperProps<HeadlessToggle, ToggleState>['renderComponent'] = 
  (component, componentState, cssClasses, dataAttributes) => (
  <button
    type="button"
    role="switch"
    aria-checked={componentState.isChecked}
    aria-disabled={componentState.isDisabled}
    onClick={(e) => component.toggle(e)}
    onMouseEnter={(e) => component.hover(true, e)}
    onMouseLeave={(e) => component.hover(false, e)}
    onFocus={(e) => component.focus(true, e)}
    onBlur={(e) => component.focus(false, e)}
    onKeyDown={(e) => component.keydown(e)}
    onMouseDown={() => component.press(true)}
    onMouseUp={() => component.press(false)}
    className={cn(
      "relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none toggle-ui",
      componentState.isDisabled ? "bg-muted" : (componentState.isChecked ? "bg-primary" : "bg-input"),
      cssClasses
    )}
    {...dataAttributes}
  >
    <span className="sr-only">Use</span>
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none toggle-knob inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
        componentState.isChecked ? "translate-x-5" : "translate-x-0"
      )}
    />
     {componentState.isLoading && <Loader2 className="absolute inset-0 m-auto h-4 w-4 animate-spin text-primary-foreground" />}
     {componentState.error && <AlertTriangle className="absolute inset-0 m-auto h-4 w-4 text-destructive" />}
  </button>
);

export const ButtonRenderer: InteractiveComponentWrapperProps<HeadlessButton, ButtonState>['renderComponent'] =
 (component, componentState, cssClasses, dataAttributes) => (
  <Button
    variant={componentState.error ? "destructive" : "default"}
    onClick={(e) => component.click(e)}
    onMouseEnter={(e) => component.hover(true, e)}
    onMouseLeave={(e) => component.hover(false, e)}
    onFocus={(e) => component.focus(true, e)}
    onBlur={(e) => component.focus(false, e)}
    onKeyDown={(e) => component.keydown(e)}
    onMouseDown={() => component.press(true)}
    onMouseUp={() => component.press(false)}
    disabled={componentState.isDisabled || componentState.isLoading}
    aria-disabled={componentState.isDisabled}
    className={cn(cssClasses, "min-w-[120px] transition-all duration-150 ease-in-out")}
    {...dataAttributes}
  >
    {componentState.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    {componentState.error && !componentState.isLoading && <AlertTriangle className="mr-2 h-4 w-4" />}
    {componentState.isDisabled && !componentState.isLoading && !componentState.error && <Ban className="mr-2 h-4 w-4" />}
    Click Me
  </Button>
);

export const InputRenderer: InteractiveComponentWrapperProps<HeadlessInput, InputState>['renderComponent'] =
 (component, componentState, cssClasses, dataAttributes) => (
  <div className="relative w-full max-w-sm">
    <ShadcnInput
      type="text"
      value={componentState.value}
      onChange={(e) => component.setValue(e.target.value, e)}
      onFocus={(e) => component.focus(true, e)}
      onBlur={(e) => component.focus(false, e)}
      disabled={componentState.isDisabled}
      readOnly={componentState.isReadOnly}
      aria-invalid={!!componentState.error || !componentState.isValid}
      aria-disabled={componentState.isDisabled}
      aria-readonly={componentState.isReadOnly}
      className={cn(
        cssClasses,
        componentState.error || !componentState.isValid ? "border-destructive focus-visible:ring-destructive" : "",
        "transition-colors duration-150 ease-in-out"
      )}
      {...dataAttributes}
      placeholder="Type something..."
    />
    {componentState.error && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />}
  </div>
);

export const CheckboxRenderer: InteractiveComponentWrapperProps<HeadlessCheckbox, CheckboxState>['renderComponent'] =
 (component, componentState, cssClasses, dataAttributes) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={componentState.isIndeterminate ? 'mixed' : componentState.isChecked}
    aria-disabled={componentState.isDisabled}
    onClick={(e) => component.toggle(e)}
    onMouseEnter={(e) => component.hover(true, e)}
    onMouseLeave={(e) => component.hover(false, e)}
    onFocus={(e) => component.focus(true, e)}
    onBlur={(e) => component.focus(false, e)}
    onKeyDown={(e) => component.keydown(e)}
    onMouseDown={() => component.press(true)}
    onMouseUp={() => component.press(false)}
    className={cn(
      "peer h-5 w-5 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checkbox-ui transition-colors duration-150 ease-in-out",
      (componentState.isChecked && !componentState.isIndeterminate) ? "bg-primary text-primary-foreground" : "bg-transparent",
      componentState.isIndeterminate ? "bg-accent text-accent-foreground" : "",
      cssClasses
    )}
    {...dataAttributes}
  >
    <div className="h-full w-full flex items-center justify-center checkbox-indicator">
      {componentState.isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : componentState.isIndeterminate ? (
        <Minus className="h-3 w-3" />
      ) : componentState.isChecked ? (
        <CheckIcon className="h-3 w-3" />
      ) : null}
    </div>
     {componentState.error && <AlertTriangle className="absolute -top-1 -right-1 h-3 w-3 text-destructive bg-background rounded-full" />}
  </button>
);

