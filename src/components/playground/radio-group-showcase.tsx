
'use client';

import React, { useState } from 'react';
import { HeadlessRadioGroup, RadioOption } from '@/components/headless-logic';
import { InteractiveComponentWrapper, RadioGroupRenderer } from './interactive-component-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const initialRadioOptions: RadioOption[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular', disabled: false },
  { value: 'svelte', label: 'Svelte', disabled: true },
];

const radioGroupUsageExample = `
import React, { useMemo, useEffect, useState } from 'react';
// Adjust import path based on your actual package name if published
import { HeadlessRadioGroup, RadioGroupState, RadioOption, CssState } from 'headless-primitives-kit/headless-radio-group';
import { useHeadlessComponent } from '@/hooks/use-headless-component'; // Your project's hook
import { cn } from '@/lib/utils'; // Your utility for classnames

// A styled radio group component using HeadlessRadioGroup
function MyStyledRadioGroup({
  options,
  initialValue,
  groupLabel,
  initialIsDisabled = false,
}: {
  options: RadioOption[];
  initialValue?: string | null;
  groupLabel: string;
  initialIsDisabled?: boolean;
}) {
  const {
    component,
    componentState,
    cssState
  } = useHeadlessComponent(HeadlessRadioGroup);

  // Sync initial props
  useEffect(() => {
    component.setState({
      options: options,
      value: initialValue === undefined ? null : initialValue, // Ensure null if undefined
      isDisabled: initialIsDisabled,
    });
  }, [component, options, initialValue, initialIsDisabled]);

  useEffect(() => {
    const handleValueChange = (_event: string, data?: any) => {
      console.log('RadioGroup value changed:', data.value);
    };
    const unsubscribe = component.subscribe('valueChanged', handleValueChange);
    return () => unsubscribe();
  }, [component]);

  const groupName = useMemo(() => \`radiogroup-\${Math.random().toString(36).substr(2, 9)}\`, []);


  return (
    <fieldset
      className={cn("p-4 border rounded-lg space-y-2", cssState.classes.join(' '))}
      disabled={componentState.isDisabled}
      {...cssState.dataAttributes} // Includes data-disabled etc.
    >
      <legend className="font-semibold mb-2">{groupLabel}</legend>
      {componentState.options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            id={\`\${groupName}-\${option.value}\`}
            name={groupName}
            value={option.value}
            checked={componentState.value === option.value}
            disabled={option.disabled || componentState.isDisabled}
            onChange={() => component.selectOption(option.value)}
            onFocus={(e) => component.focus(true, e)} // Typically focus managed by group or first item
            onBlur={(e) => component.focus(false, e)}
            className={cn(
              "form-radio h-4 w-4 text-primary border-gray-300 focus:ring-primary",
              (option.disabled || componentState.isDisabled) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
          />
          <label
            htmlFor={\`\${groupName}-\${option.value}\`}
            className={cn(
              "text-sm",
              (option.disabled || componentState.isDisabled) ? "text-muted-foreground cursor-not-allowed" : "cursor-pointer"
            )}
          >
            {option.label}
          </label>
        </div>
      ))}
      {componentState.error && <p className="text-xs text-destructive mt-1">{String(componentState.error)}</p>}
    </fieldset>
  );
}

export default MyStyledRadioGroup;
`;

export function RadioGroupShowcase() {
  const [currentOptions, setCurrentOptions] = useState<RadioOption[]>(initialRadioOptions);
  const [optionsInput, setOptionsInput] = useState(JSON.stringify(initialRadioOptions, null, 2));

  const handleSetOptions = (headlessComponent: HeadlessRadioGroup) => {
    try {
      const newOptions = JSON.parse(optionsInput);
      if (Array.isArray(newOptions) && newOptions.every(opt => typeof opt.value === 'string' && typeof opt.label === 'string')) {
        headlessComponent.setOptions(newOptions); // This updates internal state of the component instance
        setCurrentOptions(newOptions); // This updates local React state for initial overrides on re-render
      } else {
        alert("Invalid options format. Must be an array of {value: string, label: string, disabled?: boolean}.");
      }
    } catch (e) {
      alert("Error parsing JSON for options.");
    }
  };
  
  // This function needs to be passed to InteractiveComponentWrapper
  const radioCustomControls = (headlessComponent?: HeadlessRadioGroup) => (
    <div className="space-y-3">
       <div>
        <Label htmlFor="radio-options-input" className="text-xs">Options (JSON)</Label>
        <textarea
          id="radio-options-input"
          value={optionsInput}
          onChange={(e) => setOptionsInput(e.target.value)}
          className="mt-1 w-full h-24 p-2 border rounded-md text-xs font-mono bg-muted/50"
          placeholder="Enter options as JSON array..."
        />
        <Button size="sm" onClick={() => headlessComponent && handleSetOptions(headlessComponent)} className="mt-1 text-xs">
          Set Options
        </Button>
      </div>
       <div>
          <Label htmlFor="radio-value-input" className="text-xs">Selected Value</Label>
          <Input
            id="radio-value-input"
            type="text"
            defaultValue={headlessComponent?.getState().value ?? ""}
            onBlur={(e) => {
                const val = e.target.value;
                headlessComponent?.setValue(val === "" ? null : val);
            }}
            placeholder="Set value directly"
            className="mt-1 text-xs h-8"
          />
          <Button size="sm" onClick={() => headlessComponent?.setValue(null)} className="mt-1 text-xs">Clear Selection</Button>
        </div>
    </div>
  );


  return (
    <section id="radiogroup-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Radio Group Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <InteractiveComponentWrapper
          componentType={HeadlessRadioGroup}
          renderComponent={RadioGroupRenderer}
          title="Default Radio Group"
          description="Select one option from the group. Options can be individually disabled."
          initialStateOverrides={{ options: currentOptions, value: 'react' }}
          usageExampleCode={radioGroupUsageExample}
          customControls={radioCustomControls(undefined)} // Pass undefined or a way to get the instance
        />
        <InteractiveComponentWrapper
          componentType={HeadlessRadioGroup}
          renderComponent={RadioGroupRenderer}
          title="Disabled Radio Group"
          description="The entire radio group is disabled."
          initialStateOverrides={{ options: currentOptions, value: 'vue', isDisabled: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessRadioGroup}
          renderComponent={RadioGroupRenderer}
          title="Radio Group with Error"
          description="Radio group indicating an error state."
          initialStateOverrides={{ options: currentOptions, value: 'angular', error: "Invalid selection criteria" }}
        />
         <InteractiveComponentWrapper
          componentType={HeadlessRadioGroup}
          renderComponent={RadioGroupRenderer}
          title="No Initial Selection"
          description="Radio group with no option selected initially."
          initialStateOverrides={{ options: currentOptions, value: null }}
          customControls={radioCustomControls(undefined)}
        />
      </div>
    </section>
  );
}

    