
'use client';

import React from 'react';
import { HeadlessTabs } from '@/components/headless-logic';
import { InteractiveComponentWrapper, TabsRenderer } from './interactive-component-wrapper';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'; // ShadCN components
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // ShadCN components

const tabsUsageExample = `
import React, { useMemo, useEffect, useState } from 'react';
// Adjust import path based on your actual package name if published
import { HeadlessTabs, TabsState, CssState } from 'headless-primitives-kit/headless-tabs';
import { useHeadlessComponent } from '@/hooks/use-headless-component'; // Your project's hook
import { cn } from '@/lib/utils'; // Your utility for classnames
// Example: Using ShadCN Tabs components for UI
import {
  Tabs as ShadcnUITabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'; // Assuming you have these

// A styled tabs component using HeadlessTabs
function MyStyledTabs({
  tabs, // [{ id: string, title: string, content: string, disabled?: boolean }]
  initialActiveTab,
  orientation = 'horizontal', // 'horizontal' or 'vertical'
  initialIsDisabled = false,
}: {
  tabs: Array<{ id: string; title: string; content: React.ReactNode; disabled?: boolean }>;
  initialActiveTab?: string | null;
  orientation?: 'horizontal' | 'vertical';
  initialIsDisabled?: boolean;
}) {
  const {
    component,
    componentState,
    cssState
  } = useHeadlessComponent(HeadlessTabs);

  // Sync initial props
  useEffect(() => {
    component.setState({
      activeTab: initialActiveTab === undefined ? (tabs.length > 0 ? tabs[0].id : null) : initialActiveTab,
      orientation: orientation,
      isDisabled: initialIsDisabled,
    });
  }, [component, tabs, initialActiveTab, orientation, initialIsDisabled]);

  useEffect(() => {
    const handleTabActivated = (_event: string, data?: any) => {
      console.log('Tab activated:', data);
    };
    const unsubscribe = component.subscribe('tabActivated', handleTabActivated);
    return () => unsubscribe();
  }, [component]);

  return (
    <ShadcnUITabs
      value={componentState.activeTab ?? ""} // Radix requires a string value for controlled component
      onValueChange={(tabId) => component.activateTab(tabId)}
      orientation={componentState.orientation}
      className={cn("w-full max-w-lg border rounded-md p-2", cssState.classes.join(' '))}
      {...cssState.dataAttributes}
    >
      <TabsList className={cn(componentState.isDisabled && "opacity-60 cursor-not-allowed")}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled || componentState.isDisabled}
            className={cn(componentState.activeTab === tab.id && "font-semibold")}
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="p-4 mt-2 border-t">
          {tab.content}
          {componentState.isLoading && componentState.activeTab === tab.id && <p>Loading...</p>}
        </TabsContent>
      ))}
      {componentState.error && <p className="text-xs text-destructive p-2">{String(componentState.error)}</p>}
    </ShadcnUITabs>
  );
}

export default MyStyledTabs;
`;

// Define outside to avoid re-creation on every render
const exampleTabsForControls = [
  { id: 'account', title: 'Account' },
  { id: 'password', title: 'Password' },
  { id: 'notifications', title: 'Notifications' },
  { id: 'support', title: 'Support' },
];

export function TabsShowcase() {
  const tabsCustomControls = (headlessComponent?: HeadlessTabs) => {
    if (!headlessComponent) return null;

    const [currentOrientation, setCurrentOrientation] = React.useState(headlessComponent.getState().orientation);
    const [currentActiveTab, setCurrentActiveTab] = React.useState(headlessComponent.getState().activeTab);
    
    React.useEffect(() => {
        const syncState = () => {
            const state = headlessComponent.getState();
            setCurrentOrientation(state.orientation);
            setCurrentActiveTab(state.activeTab);
        };
        syncState();
        const unsub = headlessComponent.subscribe("stateChanged", syncState);
        return unsub;
    }, [headlessComponent]);


    return (
      <div className="space-y-4">
        <div>
          <Label className="text-xs font-medium">Orientation</Label>
          <RadioGroup
            value={currentOrientation}
            onValueChange={(value: 'horizontal' | 'vertical') => headlessComponent.setOrientation(value)}
            className="mt-1 flex space-x-3"
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="horizontal" id="orientation-horizontal" />
              <Label htmlFor="orientation-horizontal" className="text-xs">Horizontal</Label>
            </div>
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="vertical" id="orientation-vertical" />
              <Label htmlFor="orientation-vertical" className="text-xs">Vertical</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Label className="text-xs font-medium">Active Tab</Label>
          <Select
            value={currentActiveTab ?? ""}
            onValueChange={(value) => headlessComponent.setActiveTab(value === "" ? null : value)}
          >
            <SelectTrigger className="w-full mt-1 h-8 text-xs">
              <SelectValue placeholder="Select active tab" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="" className="text-xs">None</SelectItem>
              {exampleTabsForControls.map(tab => (
                <SelectItem key={tab.id} value={tab.id} className="text-xs">{tab.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  };

  return (
    <section id="tabs-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Tabs Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <InteractiveComponentWrapper
          componentType={HeadlessTabs}
          renderComponent={TabsRenderer}
          title="Horizontal Tabs"
          description="Standard horizontal tab navigation."
          initialStateOverrides={{ activeTab: 'account', orientation: 'horizontal' }}
          usageExampleCode={tabsUsageExample}
          customControls={tabsCustomControls(undefined)}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessTabs}
          renderComponent={TabsRenderer}
          title="Vertical Tabs"
          description="Tabs arranged vertically."
          initialStateOverrides={{ activeTab: 'password', orientation: 'vertical' }}
          customControls={tabsCustomControls(undefined)}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessTabs}
          renderComponent={TabsRenderer}
          title="Disabled Tabs Group"
          description="The entire tabs group is disabled."
          initialStateOverrides={{ activeTab: 'notifications', isDisabled: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessTabs}
          renderComponent={TabsRenderer}
          title="Tabs with Error"
          description="Tabs group indicating an error state (e.g., content loading failed)."
          initialStateOverrides={{ activeTab: 'support', error: "Failed to load tab data" }}
        />
      </div>
    </section>
  );
}

    