
'use client';

import React from 'react';
import { HeadlessSlider } from '@/components/headless-logic';
import { InteractiveComponentWrapper, SliderRenderer } from './interactive-component-wrapper';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const sliderUsageExample = `
import React, { useMemo, useEffect, useState } from 'react';
// Adjust import path based on your actual package name if published
import { HeadlessSlider, SliderState, CssState } from 'headless-primitives-kit/headless-slider';
import { useHeadlessComponent } from '@/hooks/use-headless-component'; // Your project's hook
import { cn } from '@/lib/utils'; // Your utility for classnames

// A styled slider component using HeadlessSlider
function MyStyledSlider({
  initialValue = 50,
  min = 0,
  max = 100,
  step = 1,
  initialIsDisabled = false,
  label = "Volume"
}: {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  initialIsDisabled?: boolean;
  label?: string;
}) {
  const {
    component,
    componentState,
    cssState
  } = useHeadlessComponent(HeadlessSlider);

  // Sync initial props
  useEffect(() => {
    component.setState({
      value: initialValue,
      min: min,
      max: max,
      step: step,
      isDisabled: initialIsDisabled,
    });
  }, [component, initialValue, min, max, step, initialIsDisabled]);

  useEffect(() => {
    const handleValueChange = (_event: string, data?: any) => {
      console.log('Slider value changed:', data.value);
    };
    const unsubscribe = component.subscribe('valueChanged', handleValueChange);
    return () => unsubscribe();
  }, [component]);

  const sliderId = useMemo(() => \`slider-\${Math.random().toString(36).substr(2, 9)}\`, []);

  return (
    <div className="w-full max-w-xs space-y-2">
      <label htmlFor={sliderId} className="text-sm font-medium">
        {label}: {componentState.value}
      </label>
      <input
        type="range"
        id={sliderId}
        min={componentState.min}
        max={componentState.max}
        step={componentState.step}
        value={componentState.value}
        disabled={componentState.isDisabled}
        onChange={(e) => component.setValue(Number(e.target.value), e)}
        onFocus={(e) => component.focus(true, e)}
        onBlur={(e) => component.focus(false, e)}
        onKeyDown={(e) => component.keydown(e)} // For arrow key interactions
        onMouseDown={() => component.press(true)}
        onMouseUp={() => component.press(false)}
        className={cn(
          "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          componentState.isDisabled ? "opacity-50 cursor-not-allowed" : "",
          componentState.isPressed ? "ring-2 ring-primary" : "",
          cssState.classes.join(' ')
        )}
        {...cssState.dataAttributes} // Includes aria attributes
      />
      {componentState.error && <p className="text-xs text-destructive">{String(componentState.error)}</p>}
    </div>
  );
}

export default MyStyledSlider;
`;

export function SliderShowcase() {

  const sliderCustomControls = (headlessComponent?: HeadlessSlider) => {
    const [min, setMin] = React.useState(headlessComponent?.getState().min ?? 0);
    const [max, setMax] = React.useState(headlessComponent?.getState().max ?? 100);
    const [step, setStep] = React.useState(headlessComponent?.getState().step ?? 1);
    const [value, setValue] = React.useState(headlessComponent?.getState().value ?? 50);

    React.useEffect(() => {
        if(headlessComponent) {
            const updateStates = () => {
                const state = headlessComponent.getState();
                setMin(state.min);
                setMax(state.max);
                setStep(state.step);
                setValue(state.value);
            };
            updateStates(); // Initial sync
            const unsub = headlessComponent.subscribe('stateChanged', updateStates);
            return unsub;
        }
    }, [headlessComponent]);


    const handleSetRange = () => {
      headlessComponent?.setRange(Number(min), Number(max), Number(step));
    };
    
    const handleSetValue = () => {
        headlessComponent?.setValue(Number(value));
    }

    return (
      <div className="space-y-3">
        <div>
          <Label htmlFor="slider-min-input" className="text-xs">Min</Label>
          <Input id="slider-min-input" type="number" value={min} onChange={(e) => setMin(parseFloat(e.target.value))} className="mt-1 text-xs h-8" />
        </div>
        <div>
          <Label htmlFor="slider-max-input" className="text-xs">Max</Label>
          <Input id="slider-max-input" type="number" value={max} onChange={(e) => setMax(parseFloat(e.target.value))} className="mt-1 text-xs h-8" />
        </div>
        <div>
          <Label htmlFor="slider-step-input" className="text-xs">Step</Label>
          <Input id="slider-step-input" type="number" value={step} onChange={(e) => setStep(parseFloat(e.target.value))} className="mt-1 text-xs h-8" />
        </div>
        <Button size="sm" onClick={handleSetRange} className="text-xs w-full">Set Min/Max/Step</Button>
        <hr/>
        <div>
          <Label htmlFor="slider-value-input" className="text-xs">Value</Label>
          <Input id="slider-value-input" type="number" value={value} onChange={(e) => setValue(parseFloat(e.target.value))} className="mt-1 text-xs h-8" />
        </div>
        <Button size="sm" onClick={handleSetValue} className="text-xs w-full">Set Value</Button>
      </div>
    );
  };


  return (
    <section id="slider-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Slider Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <InteractiveComponentWrapper
          componentType={HeadlessSlider}
          renderComponent={SliderRenderer}
          title="Default Slider"
          description="A standard slider for selecting a value within a range."
          initialStateOverrides={{ value: 50, min: 0, max: 100, step: 1 }}
          usageExampleCode={sliderUsageExample}
          customControls={sliderCustomControls(undefined)}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessSlider}
          renderComponent={SliderRenderer}
          title="Custom Range & Step"
          description="Slider with a range of -50 to 50, and a step of 5."
          initialStateOverrides={{ value: 0, min: -50, max: 50, step: 5 }}
          customControls={sliderCustomControls(undefined)}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessSlider}
          renderComponent={SliderRenderer}
          title="Disabled Slider"
          description="This slider is disabled and cannot be interacted with."
          initialStateOverrides={{ value: 25, min: 0, max: 100, step: 1, isDisabled: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessSlider}
          renderComponent={SliderRenderer}
          title="Slider with Error"
          description="Slider indicating an error state (e.g., value out of allowed dynamic bounds not handled by min/max)."
          initialStateOverrides={{ value: 75, min: 0, max: 100, step: 1, error: "Value exceeds limit" }}
        />
      </div>
    </section>
  );
}

    