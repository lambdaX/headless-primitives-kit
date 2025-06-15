
'use client';

import { HeadlessToggle } from '@/components/headless-logic';
import { InteractiveComponentWrapper, ToggleRenderer } from './interactive-component-wrapper';

const toggleUsageExample = `
import React, { useMemo, useEffect, useState } from 'react';
// Adjust import path based on your actual package name if published
import { HeadlessToggle, ToggleState, CssState } from 'headless-primitives-kit/headless-toggle';
import { useHeadlessComponent } from '@/hooks/use-headless-component'; // Your project's hook
import { cn } from '@/lib/utils'; // Your utility for classnames
import { Loader2, AlertTriangle } from 'lucide-react'; // Example icons

// A styled toggle/switch component using HeadlessToggle
function MyStyledToggle({
  label,
  initialIsChecked = false,
  initialIsDisabled = false,
  initialIsLoading = false,
}: {
  label: string;
  initialIsChecked?: boolean;
  initialIsDisabled?: boolean;
  initialIsLoading?: boolean;
}) {
  const {
    component,
    componentState,
    cssState
  } = useHeadlessComponent(HeadlessToggle);

  // Sync initial props
  useEffect(() => {
    component.setState({
      isChecked: initialIsChecked,
      isDisabled: initialIsDisabled,
      isLoading: initialIsLoading,
    });
  }, [component, initialIsChecked, initialIsDisabled, initialIsLoading]);

  useEffect(() => {
    const handleToggle = (_event: string, data?: any) => {
      console.log('Toggle state changed:', data);
    };
    const unsubscribe = component.subscribe('toggled', handleToggle);
    return () => unsubscribe();
  }, [component]);

  const uniqueId = useMemo(() => \`toggle-\${Math.random().toString(36).substr(2, 9)}\`, []);

  return (
    <div className="flex items-center space-x-2">
      <button
        type="button"
        role="switch"
        id={uniqueId}
        aria-checked={componentState.isChecked}
        aria-disabled={componentState.isDisabled || componentState.isLoading}
        onClick={(e) => component.toggle(e)}
        onMouseEnter={(e) => component.hover(true, e)}
        onMouseLeave={(e) => component.hover(false, e)}
        onFocus={(e) => component.focus(true, e)}
        onBlur={(e) => component.focus(false, e)}
        onKeyDown={(e) => component.keydown(e)}
        onMouseDown={() => component.press(true)}
        onMouseUp={() => component.press(false)}
        disabled={componentState.isDisabled || componentState.isLoading}
        className={cn(
          "relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent",
          "transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          (componentState.isDisabled || componentState.isLoading) ? "bg-muted opacity-50 cursor-not-allowed" 
            : componentState.isChecked ? "bg-primary" 
            : "bg-input",
          cssState.classes.join(' ')
        )}
        {...cssState.dataAttributes}
      >
        <span className="sr-only">{label}</span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0",
            "transition duration-200 ease-in-out",
            componentState.isChecked ? "translate-x-5" : "translate-x-0"
          )}
        />
        {componentState.isLoading && <Loader2 className="absolute inset-0 m-auto h-4 w-4 animate-spin text-primary-foreground" />}
        {componentState.error && !componentState.isLoading && <AlertTriangle className="absolute inset-0 m-auto h-4 w-4 text-destructive" />}
      </button>
      <label
        htmlFor={uniqueId}
        className={cn(
          "text-sm font-medium leading-none",
          (componentState.isDisabled || componentState.isLoading) ? "text-muted-foreground cursor-not-allowed" : "cursor-pointer"
        )}
      >
        {label}
      </label>
    </div>
  );
}

export default MyStyledToggle;
`;


export function ToggleShowcase() {
  return (
    <section id="toggle-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Toggle Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <InteractiveComponentWrapper
          componentType={HeadlessToggle}
          renderComponent={ToggleRenderer}
          title="Default Toggle"
          description="A standard toggle switch. Can be on or off."
          usageExampleCode={toggleUsageExample}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessToggle}
          renderComponent={ToggleRenderer}
          title="Initially Checked"
          description="This toggle starts in the 'checked' (on) state."
          initialStateOverrides={{ isChecked: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessToggle}
          renderComponent={ToggleRenderer}
          title="Disabled & Unchecked"
          description="A disabled toggle that is off and cannot be interacted with."
          initialStateOverrides={{ isDisabled: true, isChecked: false }}
        />
         <InteractiveComponentWrapper
          componentType={HeadlessToggle}
          renderComponent={ToggleRenderer}
          title="Loading Toggle"
          description="This toggle is in a loading state, often non-interactive and visually distinct."
          initialStateOverrides={{ isLoading: true, isChecked: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessToggle}
          renderComponent={ToggleRenderer}
          title="Toggle with Error"
          description="This toggle indicates an error. The visual representation of error might override other states."
          initialStateOverrides={{ error: "Failed to save preference", isChecked: false }}
        />
      </div>
    </section>
  );
}

    