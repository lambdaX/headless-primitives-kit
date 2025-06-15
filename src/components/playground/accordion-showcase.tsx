
'use client';

import React from 'react';
import { HeadlessAccordion } from '@/components/headless-logic';
import { InteractiveComponentWrapper, AccordionRenderer } from './interactive-component-wrapper';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // ShadCN components

const accordionUsageExample = `
import React, { useMemo, useEffect, useState } from 'react';
// Adjust import path based on your actual package name if published
import { HeadlessAccordion, AccordionState, CssState } from 'headless-primitives-kit/headless-accordion';
import { useHeadlessComponent } from '@/hooks/use-headless-component'; // Your project's hook
import { cn } from '@/lib/utils'; // Your utility for classnames
// Example: Using ShadCN Accordion components for UI
import {
  Accordion as ShadcnUIAccordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'; // Assuming you have these

// A styled accordion component using HeadlessAccordion
function MyStyledAccordion({
  items, // [{ id: string, title: string, content: string, disabled?: boolean }]
  initialOpenItems = [],
  type = 'single', // 'single' or 'multiple'
  collapsible = false, // Only for 'single' type
  initialIsDisabled = false,
}: {
  items: Array<{ id: string; title: string; content: string; disabled?: boolean }>;
  initialOpenItems?: string[];
  type?: 'single' | 'multiple';
  collapsible?: boolean;
  initialIsDisabled?: boolean;
}) {
  const {
    component,
    componentState,
    cssState
  } = useHeadlessComponent(HeadlessAccordion);

  // Sync initial props
  useEffect(() => {
    component.setState({
      openItems: initialOpenItems,
      type: type,
      collapsible: type === 'single' ? collapsible : false, // Collapsible only relevant for single type
      isDisabled: initialIsDisabled,
    });
  }, [component, initialOpenItems, type, collapsible, initialIsDisabled]);

  useEffect(() => {
    const handleItemToggle = (_event: string, data?: any) => {
      console.log('Accordion item toggled:', data);
    };
    const unsubscribe = component.subscribe('itemToggled', handleItemToggle);
    return () => unsubscribe();
  }, [component]);

  return (
    <ShadcnUIAccordion
      type={componentState.type}
      // Radix 'value' prop expects string for single, string[] for multiple
      value={componentState.type === 'single' ? componentState.openItems[0] || "" : componentState.openItems}
      // Radix 'collapsible' prop only for type 'single'
      collapsible={componentState.type === 'single' ? componentState.collapsible : undefined}
      // onValueChange is tricky to map to component.toggleItem.
      // It's often better to handle clicks on triggers directly.
      // For this example, we let HeadlessAccordion manage state and reflect it in 'value'.
      disabled={componentState.isDisabled}
      className={cn("w-full max-w-md border rounded-md", cssState.classes.join(' '))}
      {...cssState.dataAttributes}
    >
      {items.map((item) => (
        <AccordionItem value={item.id} key={item.id} disabled={item.disabled || componentState.isDisabled}>
          <AccordionTrigger
            // Critical: Use onClick to call the headless component's method for precise control
            onClick={(e) => {
              // Prevent default behavior if Radix/ShadCN trigger handles its own state.
              // We want our headless component to be the source of truth.
              e.preventDefault(); 
              if (!(item.disabled || componentState.isDisabled)) {
                component.toggleItem(item.id, item.disabled);
              }
            }}
            disabled={item.disabled || componentState.isDisabled}
            // Visually indicate open state based on HeadlessAccordion's state
            className={cn(componentState.openItems.includes(item.id) && "text-primary")}
          >
            {item.title}
          </AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
      {componentState.error && <p className="text-xs text-destructive p-2">{String(componentState.error)}</p>}
    </ShadcnUIAccordion>
  );
}

export default MyStyledAccordion;
`;

export function AccordionShowcase() {
  const accordionCustomControls = (headlessComponent?: HeadlessAccordion) => {
    if (!headlessComponent) return null;
    
    const [currentType, setCurrentType] = React.useState(headlessComponent.getState().type);
    const [currentCollapsible, setCurrentCollapsible] = React.useState(headlessComponent.getState().collapsible);

    React.useEffect(() => {
        const syncState = () => {
            const state = headlessComponent.getState();
            setCurrentType(state.type);
            setCurrentCollapsible(state.collapsible);
        };
        syncState();
        const unsub = headlessComponent.subscribe("stateChanged", syncState);
        return unsub;

    }, [headlessComponent]);


    return (
      <div className="space-y-4">
        <div>
          <Label className="text-xs font-medium">Accordion Type</Label>
          <RadioGroup
            value={currentType}
            onValueChange={(value: 'single' | 'multiple') => headlessComponent.setType(value)}
            className="mt-1 flex space-x-3"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="single" id="type-single" />
              <Label htmlFor="type-single" className="text-xs">Single</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="multiple" id="type-multiple" />
              <Label htmlFor="type-multiple" className="text-xs">Multiple</Label>
            </div>
          </RadioGroup>
        </div>
        {currentType === 'single' && (
          <div className="flex items-center space-x-2">
            <Switch
              id="collapsible-switch"
              checked={currentCollapsible}
              onCheckedChange={(checked) => headlessComponent.setCollapsible(checked)}
              disabled={currentType !== 'single'}
            />
            <Label htmlFor="collapsible-switch" className="text-xs">Collapsible (Single Type)</Label>
          </div>
        )}
        {/* Managing openItems via UI is complex; suggest using Inspector and direct interaction */}
      </div>
    );
  };

  return (
    <section id="accordion-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Accordion Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <InteractiveComponentWrapper
          componentType={HeadlessAccordion}
          renderComponent={AccordionRenderer}
          title="Single Type Accordion"
          description="Only one item can be open at a time. 'Collapsible' allows closing the open item."
          initialStateOverrides={{ type: 'single', collapsible: true, openItems: ['item-1'] }}
          usageExampleCode={accordionUsageExample}
          customControls={accordionCustomControls(undefined)}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessAccordion}
          renderComponent={AccordionRenderer}
          title="Multiple Type Accordion"
          description="Multiple items can be open simultaneously."
          initialStateOverrides={{ type: 'multiple', openItems: ['item-1', 'item-3'] }}
          customControls={accordionCustomControls(undefined)}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessAccordion}
          renderComponent={AccordionRenderer}
          title="Disabled Accordion"
          description="The entire accordion group is disabled."
          initialStateOverrides={{ type: 'single', isDisabled: true, openItems: ['item-2'] }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessAccordion}
          renderComponent={AccordionRenderer}
          title="Accordion with Error"
          description="Accordion indicating an error state."
          initialStateOverrides={{ type: 'multiple', openItems: [], error: "Failed to load content" }}
        />
      </div>
    </section>
  );
}

    