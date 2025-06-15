
'use client';

import { HeadlessButton } from '@/components/headless-logic';
import { InteractiveComponentWrapper, ButtonRenderer } from './interactive-component-wrapper';

const buttonUsageExample = `
import React, { useMemo, useEffect, useState } from 'react';
// Adjust import path based on your actual package name if published
import { HeadlessButton, ButtonState, CssState } from 'headless-primitives-kit/headless-button'; 
import { useHeadlessComponent } from '@/hooks/use-headless-component'; // Your project's hook for state management
import { cn } from '@/lib/utils'; // Your utility for classnames, e.g., from ShadCN
import { Loader2, AlertTriangle, Ban } from 'lucide-react'; // Example icons

// A styled button component using HeadlessButton
function MyStyledButton({ 
  initialText = "Click Me",
  onActualClick,
  initialIsDisabled = false,
  initialIsLoading = false,
}: {
  initialText?: string;
  onActualClick?: (event?: React.SyntheticEvent | Event) => void;
  initialIsDisabled?: boolean;
  initialIsLoading?: boolean;
}) {
  const {
    component,
    componentState,
    cssState
  } = useHeadlessComponent(HeadlessButton);

  // Optional: Sync initial props to headless state
  useEffect(() => {
    component.setState({ isDisabled: initialIsDisabled, isLoading: initialIsLoading });
  }, [component, initialIsDisabled, initialIsLoading]);

  // Example: Subscribe to the 'clicked' event from the headless component
  useEffect(() => {
    if (!onActualClick) return;
    const handleHeadlessClick = (_event: string, data?: any) => {
      console.log('Headless button clicked event!', data);
      onActualClick(data?.originalEvent);
    };
    const unsubscribe = component.subscribe('clicked', handleHeadlessClick);
    return () => unsubscribe(); // Cleanup subscription
  }, [component, onActualClick]);

  return (
    <button
      type="button"
      onClick={(e) => component.click(e)} // Delegate click to headless component
      onMouseEnter={(e) => component.hover(true, e)}
      onMouseLeave={(e) => component.hover(false, e)}
      onFocus={(e) => component.focus(true, e)}
      onBlur={(e) => component.focus(false, e)}
      onKeyDown={(e) => component.keydown(e)}
      onMouseDown={() => component.press(true)}
      onMouseUp={() => component.press(false)}
      disabled={componentState.isDisabled || componentState.isLoading}
      aria-disabled={componentState.isDisabled || componentState.isLoading}
      // Apply base headless classes and specific styling
      className={cn(
        "inline-flex items-center justify-center px-4 py-2 rounded-md shadow font-semibold",
        "transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2",
        componentState.isDisabled ? "bg-muted text-muted-foreground cursor-not-allowed"
          : componentState.isLoading ? "bg-primary/50 text-primary-foreground cursor-wait"
          : componentState.error ? "bg-destructive text-destructive-foreground"
          : componentState.isPressed ? "bg-primary/80 text-primary-foreground ring-primary"
          : componentState.isFocused ? "ring-ring bg-primary text-primary-foreground"
          : componentState.isHovered ? "bg-primary/90 text-primary-foreground"
          : "bg-primary text-primary-foreground",
        cssState.classes.join(' ') // Base headless classes for data-attributes driven styles
      )}
      {...cssState.dataAttributes} // Includes data-disabled, data-loading etc.
    >
      {componentState.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {componentState.error && !componentState.isLoading && <AlertTriangle className="mr-2 h-4 w-4" />}
      {componentState.isDisabled && !componentState.isLoading && !componentState.error && <Ban className="mr-2 h-4 w-4" />}
      {!componentState.isLoading && !componentState.error ? initialText : (componentState.error ? 'Error' : 'Processing...')}
    </button>
  );
}

export default MyStyledButton;
`;

export function ButtonShowcase() {
  return (
    <section id="button-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Button Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <InteractiveComponentWrapper
          componentType={HeadlessButton}
          renderComponent={ButtonRenderer}
          title="Default Button"
          description="A standard clickable button. Demonstrates basic interactions like hover, focus, and press."
          usageExampleCode={buttonUsageExample}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessButton}
          renderComponent={ButtonRenderer}
          title="Disabled Button"
          description="This button is initialized as disabled. It should not be interactive."
          initialStateOverrides={{ isDisabled: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessButton}
          renderComponent={ButtonRenderer}
          title="Loading Button"
          description="This button shows a loading state, typically making it non-interactive."
          initialStateOverrides={{ isLoading: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessButton}
          renderComponent={ButtonRenderer}
          title="Error Button"
          description="This button indicates an error state, which might change its appearance and behavior."
          initialStateOverrides={{ error: 'Something went wrong!' }}
        />
      </div>
    </section>
  );
}

    