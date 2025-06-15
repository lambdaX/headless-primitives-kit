
'use client';

import { HeadlessCheckbox } from '@/components/headless-logic';
import { InteractiveComponentWrapper, CheckboxRenderer } from './interactive-component-wrapper';

const checkboxUsageExample = `
import React, { useMemo, useEffect, useState } from 'react';
// Adjust import path based on your actual package name if published
import { HeadlessCheckbox, CheckboxState, CssState } from 'headless-primitives-kit/headless-checkbox';
import { useHeadlessComponent } from '@/hooks/use-headless-component'; // Your project's hook
import { cn } from '@/lib/utils'; // Your utility for classnames
import { Check, Minus, Loader2, AlertTriangle } from 'lucide-react'; // Example icons

// A styled checkbox component using HeadlessCheckbox
function MyStyledCheckbox({
  label,
  initialIsChecked = false,
  initialIsIndeterminate = false,
  initialIsDisabled = false,
}: {
  label: string;
  initialIsChecked?: boolean;
  initialIsIndeterminate?: boolean;
  initialIsDisabled?: boolean;
}) {
  const {
    component,
    componentState,
    cssState
  } = useHeadlessComponent(HeadlessCheckbox);

  // Sync initial props
  useEffect(() => {
    component.setState({
      isChecked: initialIsChecked,
      isIndeterminate: initialIsIndeterminate,
      isDisabled: initialIsDisabled,
    });
  }, [component, initialIsChecked, initialIsIndeterminate, initialIsDisabled]);

  useEffect(() => {
    const handleToggle = (_event: string, data?: any) => {
      console.log('Checkbox toggled:', data);
    };
    const unsubscribe = component.subscribe('toggled', handleToggle);
    return () => unsubscribe();
  }, [component]);

  const uniqueId = useMemo(() => \`checkbox-\${Math.random().toString(36).substr(2, 9)}\`, []);

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="checkbox"
        id={uniqueId}
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
        disabled={componentState.isDisabled}
        className={cn(
          "relative peer h-5 w-5 shrink-0 rounded-sm border-2 transition-colors duration-150 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          componentState.isDisabled ? "opacity-50 cursor-not-allowed border-muted"
            : componentState.isPressed ? "ring-2 ring-ring ring-offset-1"
            : "",
          (componentState.isChecked && !componentState.isIndeterminate) ? "bg-primary text-primary-foreground border-primary"
            : componentState.isIndeterminate ? "bg-accent text-accent-foreground border-accent"
            : "bg-transparent border-primary",
          cssState.classes.join(' ')
        )}
        {...cssState.dataAttributes}
      >
        <div className="h-full w-full flex items-center justify-center">
          {componentState.isLoading ? <Loader2 className="h-3 w-3 animate-spin" />
            : componentState.isIndeterminate ? <Minus className="h-3 w-3" />
            : componentState.isChecked ? <Check className="h-3 w-3" />
            : null}
        </div>
        {componentState.error && !componentState.isDisabled && 
          <AlertTriangle className="absolute -top-1.5 -right-1.5 h-4 w-4 text-destructive bg-background rounded-full p-0.5 shadow" />}
      </button>
      <label
        htmlFor={uniqueId}
        className={cn(
          "text-sm font-medium leading-none",
          componentState.isDisabled ? "text-muted-foreground cursor-not-allowed" : "cursor-pointer"
        )}
      >
        {label}
      </label>
    </div>
  );
}

export default MyStyledCheckbox;
`;


export function CheckboxShowcase() {
  return (
    <section id="checkbox-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Checkbox Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Default Checkbox"
          description="A standard checkbox that can be checked or unchecked."
          usageExampleCode={checkboxUsageExample}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Initially Checked"
          description="This checkbox starts in the checked state."
          initialStateOverrides={{ isChecked: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Indeterminate Checkbox"
          description="This checkbox is in an indeterminate state, often used for parent checkboxes in a list."
          initialStateOverrides={{ isIndeterminate: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Disabled & Unchecked"
          description="A disabled checkbox that is unchecked."
          initialStateOverrides={{ isDisabled: true, isChecked: false }}
        />
         <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Disabled & Checked"
          description="A disabled checkbox that is checked."
          initialStateOverrides={{ isDisabled: true, isChecked: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Checkbox with Error"
          description="A checkbox indicating an error state. Note: Error state might visually override other states."
          initialStateOverrides={{ error: "Selection conflict", isChecked: true }}
        />
      </div>
    </section>
  );
}

    