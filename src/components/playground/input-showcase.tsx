
'use client';

import { HeadlessInput } from '@/components/headless-logic';
import { InteractiveComponentWrapper, InputRenderer } from './interactive-component-wrapper';

const inputUsageExample = `
import React, { useMemo, useEffect, useState } from 'react';
// Adjust import path based on your actual package name if published
import { HeadlessInput, InputState, CssState } from 'headless-primitives-kit/headless-input';
import { useHeadlessComponent } from '@/hooks/use-headless-component'; // Your project's hook
import { cn } from '@/lib/utils'; // Your utility for classnames
import { AlertTriangle } from 'lucide-react'; // Example icon

// A styled input component using HeadlessInput
function MyStyledInput({
  initialValue = "",
  placeholder = "Type here...",
  initialIsDisabled = false,
  initialIsReadOnly = false,
  type = "text",
}: {
  initialValue?: string;
  placeholder?: string;
  initialIsDisabled?: boolean;
  initialIsReadOnly?: boolean;
  type?: string;
}) {
  const {
    component,
    componentState,
    cssState
  } = useHeadlessComponent(HeadlessInput);

  // Sync initial props
  useEffect(() => {
    component.setState({
      value: initialValue,
      isDisabled: initialIsDisabled,
      isReadOnly: initialIsReadOnly,
    });
  }, [component, initialValue, initialIsDisabled, initialIsReadOnly]);

  useEffect(() => {
    const handleValueChange = (_event: string, data?: any) => {
      console.log('Input value changed:', data.newValue);
      // Example validation:
      if (data.newValue.length > 0 && data.newValue.length < 3) {
        component.setError("Value must be at least 3 characters");
      } else {
        component.setError(null); // Clear error
        // Or, if you have separate validation:
        // component.setValid(data.newValue.length >=3);
      }
    };
    const unsubscribe = component.subscribe('valueChanged', handleValueChange);
    return () => unsubscribe();
  }, [component]);

  return (
    <div className="relative w-full max-w-sm">
      <input
        type={type}
        value={componentState.value}
        placeholder={placeholder}
        onChange={(e) => component.setValue(e.target.value, e)}
        onFocus={(e) => component.focus(true, e)}
        onBlur={(e) => component.focus(false, e)}
        disabled={componentState.isDisabled}
        readOnly={componentState.isReadOnly}
        aria-invalid={!!componentState.error || !componentState.isValid}
        aria-disabled={componentState.isDisabled}
        aria-readonly={componentState.isReadOnly}
        className={cn(
          "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          componentState.isDisabled ? "cursor-not-allowed opacity-50 bg-muted" : "",
          componentState.isReadOnly ? "bg-muted/50" : "",
          (componentState.error || !componentState.isValid) ? "border-destructive text-destructive focus-visible:ring-destructive" : "border-input",
          cssState.classes.join(' ')
        )}
        {...cssState.dataAttributes}
      />
      {(componentState.error || !componentState.isValid) && !componentState.isDisabled &&
        <AlertTriangle className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />}
    </div>
  );
}

export default MyStyledInput;
`;

export function InputShowcase() {
  return (
    <section id="input-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Input Showcase</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <InteractiveComponentWrapper
          componentType={HeadlessInput}
          renderComponent={InputRenderer}
          title="Default Input"
          description="A standard text input field. Try typing to see value changes and validation (e.g. error if less than 3 chars)."
          usageExampleCode={inputUsageExample}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessInput}
          renderComponent={InputRenderer}
          title="Input with Initial Value"
          description="This input has a pre-filled value."
          initialStateOverrides={{ value: 'Hello World' }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessInput}
          renderComponent={InputRenderer}
          title="Disabled Input"
          description="This input is disabled and cannot be edited or focused."
          initialStateOverrides={{ isDisabled: true, value: "Can't edit me" }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessInput}
          renderComponent={InputRenderer}
          title="Read-only Input"
          description="This input is read-only. It can be focused and its value selected, but not changed."
          initialStateOverrides={{ isReadOnly: true, value: "Can't change me" }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessInput}
          renderComponent={InputRenderer}
          title="Input with Error"
          description="This input shows an error state, typically due to failed validation."
          initialStateOverrides={{ error: 'Invalid input, please correct.', value: "Oops!" }}
        />
      </div>
    </section>
  );
}

    