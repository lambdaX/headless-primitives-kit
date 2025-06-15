
'use client';

import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input as ShadcnInput } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHeadlessComponent } from '@/hooks/use-headless-component';
import type { HeadlessComponent, BaseComponentState, CssState } from '@/components/headless-logic';
import { ComponentInspector } from './component-inspector';
import { UndoRedoControls } from './undo-redo-controls';
import { cn } from '@/lib/utils';

import { HeadlessToggle, type ToggleState } from '@/components/headless-logic/headless-toggle';
import { HeadlessButton, type ButtonState } from '@/components/headless-logic/headless-button';
import { HeadlessInput, type InputState } from '@/components/headless-logic/headless-input';
import { HeadlessCheckbox, type CheckboxState } from '@/components/headless-logic/headless-checkbox';
import { HeadlessRadioGroup, type RadioGroupState, type RadioOption } from '@/components/headless-logic/headless-radio-group';
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem as ShadcnRadioGroupItem } from '@/components/ui/radio-group';
import { HeadlessSlider, type SliderState } from '@/components/headless-logic/headless-slider';
import { Slider as ShadcnSlider } from '@/components/ui/slider';
import { HeadlessAccordion, type AccordionState } from '@/components/headless-logic/headless-accordion';
import {
  Accordion as ShadcnAccordion,
  AccordionItem as ShadcnAccordionItem,
  AccordionTrigger as ShadcnAccordionTrigger,
  AccordionContent as ShadcnAccordionContent,
} from '@/components/ui/accordion';
import { HeadlessTabs, type TabsState } from '@/components/headless-logic/headless-tabs';
import {
  Tabs as ShadcnTabs,
  TabsList as ShadcnTabsList,
  TabsTrigger as ShadcnTabsTrigger,
  TabsContent as ShadcnTabsContent,
} from '@/components/ui/tabs';


import { AlertTriangle, Ban, CheckIcon, Loader2, Minus, Settings2, Palette, Info } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


type SupportedHeadlessComponent = HeadlessToggle | HeadlessButton | HeadlessInput | HeadlessCheckbox | HeadlessRadioGroup | HeadlessSlider | HeadlessAccordion | HeadlessTabs;
type SupportedHeadlessState = ToggleState | ButtonState | InputState | CheckboxState | RadioGroupState | SliderState | AccordionState | TabsState;

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
  usageExampleCode?: string;
  customControls?: React.ReactNode | ((componentInstance?: TComp) => React.ReactNode);
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
  usageExampleCode,
  customControls,
}: InteractiveComponentWrapperProps<TComp, TState>) {

  const { component, componentState, cssState, history, undo, redo } =
    useHeadlessComponent(componentType as new () => TComp);

  // Apply initial state overrides only once when the component instance is created,
  // or if initialStateOverrides itself is changed (though it's usually static)
  useMemo(() => {
    if (initialStateOverrides) {
      component.setState(initialStateOverrides as Partial<BaseComponentState>);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component, JSON.stringify(initialStateOverrides)]); // Stringify for deep comparison if overrides object changes


  const commonControls = (
    <>
      <div className="flex items-center space-x-2">
        <Switch
          id={`${title}-disabled-switch`}
          checked={!!componentState.isDisabled}
          onCheckedChange={(checked) => component.setState({ isDisabled: checked })}
          aria-labelledby={`${title}-disabled-label`}
        />
        <Label htmlFor={`${title}-disabled-switch`} id={`${title}-disabled-label`}>Disabled</Label>
      </div>
      {'isLoading' in componentState && typeof componentState.isLoading === 'boolean' && (
        <div className="flex items-center space-x-2">
          <Switch
            id={`${title}-loading-switch`}
            checked={!!componentState.isLoading}
            onCheckedChange={(checked) => component.setState({ isLoading: checked } as Partial<BaseComponentState>)}
            aria-labelledby={`${title}-loading-label`}
          />
          <Label htmlFor={`${title}-loading-switch`} id={`${title}-loading-label`}>Loading</Label>
        </div>
      )}
      <div className="flex items-center space-x-2">
         <Switch
            id={`${title}-error-switch`}
            checked={!!componentState.error}
            onCheckedChange={(checked) => component.setState({ error: checked ? 'Sample Error From Control' : null })}
            aria-labelledby={`${title}-error-label`}
          />
        <Label htmlFor={`${title}-error-switch`} id={`${title}-error-label`}>Error</Label>
      </div>
    </>
  );

  let componentSpecificControls = null;
  if (component instanceof HeadlessInput) {
    componentSpecificControls = (
      <div className="flex items-center space-x-2">
        <Switch
          id={`${title}-readonly-switch`}
          checked={!!(componentState as InputState).isReadOnly}
          onCheckedChange={(checked) => (component as HeadlessInput).setReadOnly(checked)}
          aria-labelledby={`${title}-readonly-label`}
        />
        <Label htmlFor={`${title}-readonly-switch`} id={`${title}-readonly-label`}>Read-only</Label>
      </div>
    );
  } else if (component instanceof HeadlessCheckbox) {
     componentSpecificControls = (
      <div className="flex items-center space-x-2">
        <Switch
          id={`${title}-indeterminate-switch`}
          checked={!!(componentState as CheckboxState).isIndeterminate}
          onCheckedChange={(checked) => (component as HeadlessCheckbox).setIndeterminate(checked)}
          aria-labelledby={`${title}-indeterminate-label`}
        />
        <Label htmlFor={`${title}-indeterminate-switch`} id={`${title}-indeterminate-label`}>Indeterminate</Label>
      </div>
    );
  }

  const renderedCustomControls = typeof customControls === 'function'
    ? customControls(component as TComp)
    : customControls;


  return (
    <Card className="w-full shadow-xl overflow-hidden flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6 flex-grow">
        <div className="p-6 border rounded-lg bg-card/80 flex items-center justify-center min-h-[120px] transition-all duration-300 ease-in-out transform hover:scale-[1.02] focus-within:ring-2 focus-within:ring-accent focus-within:ring-offset-2">
          {renderComponent(component, componentState as TState, cssState.classes, cssState.dataAttributes)}
        </div>

        {(commonControls || componentSpecificControls || renderedCustomControls) && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Settings2 className="mr-2 h-4 w-4" /> Configure State
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 space-y-3 p-4 border rounded-md bg-background">
                <h4 className="font-semibold text-md text-foreground/90">State Controls:</h4>
                <div className="grid grid-cols-1 gap-4">
                  {commonControls}
                  {componentSpecificControls}
                  {renderedCustomControls}
                </div>
              </PopoverContent>
            </Popover>
        )}

        <UndoRedoControls undo={undo} redo={redo} history={history} />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              <Palette className="mr-2 h-4 w-4" /> Inspect State & Styles
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] sm:w-[500px] md:w-[600px]">
             <ComponentInspector componentInstance={component} componentState={componentState} cssState={cssState} />
          </PopoverContent>
        </Popover>

        {usageExampleCode && (
           <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full">
                <Info className="mr-2 h-4 w-4" /> View Usage Example
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] sm:w-[600px] md:w-[700px] max-h-[80vh] overflow-y-auto">
              <Card className="border-none shadow-none">
                <CardHeader className="p-2">
                  <CardTitle className="text-xl font-semibold">React Usage Example</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-auto max-h-[60vh] w-full rounded-md border bg-muted/50 p-1">
                    <pre className="text-xs p-3 font-code whitespace-pre-wrap break-all">
                      <code>{usageExampleCode.trim()}</code>
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground p-4 border-t">
        Interact with the component above or use controls to see state changes.
      </CardFooter>
    </Card>
  );
}


// --- RENDERERS for each component type ---

export const ToggleRenderer: InteractiveComponentWrapperProps<HeadlessToggle, ToggleState>['renderComponent'] =
  (component, componentState, cssClasses, dataAttributes) => (
  <button
    type="button"
    role="switch"
    aria-checked={componentState.isChecked}
    aria-disabled={componentState.isDisabled || componentState.isLoading}
    onClick={(e) => component.toggle(e)}
    onMouseEnter={(e) => component.hover(true, e)}
    onMouseLeave={(e) => component.hover(false, e)}
    onFocus={(e) => component.focus(true, e)}
    onBlur={(e) => component.focus(false, e)}
    onKeyDown={(e) => component.keydown(e.nativeEvent)}
    onMouseDown={() => component.press(true)}
    onMouseUp={() => component.press(false)}
    className={cn(
      "relative inline-flex items-center h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none toggle-ui",
      (componentState.isDisabled || componentState.isLoading) ? "bg-muted opacity-50 cursor-not-allowed" : (componentState.isChecked ? "bg-primary" : "bg-input"),
      cssClasses
    )}
    {...dataAttributes}
    disabled={componentState.isDisabled || componentState.isLoading}
  >
    <span className="sr-only">Toggle</span>
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none toggle-knob inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
        componentState.isChecked ? "translate-x-5" : "translate-x-0"
      )}
    />
     {componentState.isLoading && <Loader2 className="absolute inset-0 m-auto h-4 w-4 animate-spin text-primary-foreground" />}
     {componentState.error && !componentState.isLoading && <AlertTriangle className="absolute inset-0 m-auto h-4 w-4 text-destructive" />}
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
    onKeyDown={(e) => component.keydown(e.nativeEvent)}
    onMouseDown={() => component.press(true)}
    onMouseUp={() => component.press(false)}
    disabled={componentState.isDisabled || componentState.isLoading}
    aria-disabled={componentState.isDisabled || componentState.isLoading}
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
        (componentState.error || !componentState.isValid) ? "border-destructive focus-visible:ring-destructive" : "",
        "transition-colors duration-150 ease-in-out"
      )}
      {...dataAttributes}
      placeholder="Type something..."
    />
    {(componentState.error || !componentState.isValid) && !componentState.isDisabled && <AlertTriangle className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />}
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
    onKeyDown={(e) => component.keydown(e.nativeEvent)}
    onMouseDown={() => component.press(true)}
    onMouseUp={() => component.press(false)}
    disabled={componentState.isDisabled}
    className={cn(
      "relative peer h-5 w-5 shrink-0 rounded-sm border-2 border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 checkbox-ui transition-colors duration-150 ease-in-out",
      componentState.isDisabled ? "opacity-50 cursor-not-allowed border-muted" : "",
      (componentState.isChecked && !componentState.isIndeterminate) ? "bg-primary text-primary-foreground border-primary" : "bg-transparent",
      componentState.isIndeterminate ? "bg-accent text-accent-foreground border-accent" : "",
      componentState.isPressed && !componentState.isDisabled ? "ring-2 ring-ring ring-offset-1" : "",
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
     {componentState.error && !componentState.isDisabled && <AlertTriangle className="absolute -top-1.5 -right-1.5 h-4 w-4 text-destructive bg-background rounded-full p-0.5 shadow" />}
  </button>
);

export const RadioGroupRenderer: InteractiveComponentWrapperProps<HeadlessRadioGroup, RadioGroupState>['renderComponent'] =
 (component, componentState, cssClasses, dataAttributes) => (
  <ShadcnRadioGroup
    value={componentState.value ?? ''} // Radix needs a string value, ensure it's not null
    onValueChange={(value) => component.selectOption(value)}
    disabled={componentState.isDisabled}
    className={cn('flex flex-col space-y-2 p-2 rounded-md border', cssClasses)}
    {...dataAttributes}
    aria-label={dataAttributes['aria-label'] || "Sample Radio Group"}
  >
    {componentState.options.map((option: RadioOption) => (
      <div key={option.value} className="flex items-center space-x-3">
        <ShadcnRadioGroupItem
          value={option.value}
          id={`interactive-${option.value}-radio`} // Ensuring unique ID for interactive renderer
          disabled={option.disabled || componentState.isDisabled}
          className={cn(componentState.isFocused && componentState.value === option.value && "ring-2 ring-ring")}
        />
        <Label
          htmlFor={`interactive-${option.value}-radio`}
          className={cn(
            (option.disabled || componentState.isDisabled) && "text-muted-foreground cursor-not-allowed",
            !option.disabled && !componentState.isDisabled && "cursor-pointer"
          )}
        >
          {option.label}
          {option.disabled && " (Option Disabled)"}
        </Label>
      </div>
    ))}
    {componentState.isDisabled && <p className="text-xs text-muted-foreground mt-2">Entire group is disabled.</p>}
    {componentState.error && <p className="text-xs text-destructive mt-2">{String(componentState.error)}</p>}
  </ShadcnRadioGroup>
);

const exampleSliderTitle = "Example Slider";

export const SliderRenderer: InteractiveComponentWrapperProps<HeadlessSlider, SliderState>['renderComponent'] =
 (component, componentState, cssClasses, dataAttributes) => (
  <div className="w-3/4 space-y-4 p-2 rounded-md border">
    <Label htmlFor={`${exampleSliderTitle}-slider-input-interactive`} className="text-sm font-medium">
      Value: {componentState.value} (Min: {componentState.min}, Max: {componentState.max}, Step: {componentState.step})
    </Label>
    <ShadcnSlider
      id={`${exampleSliderTitle}-slider-input-interactive`} // Ensuring unique ID for interactive renderer
      value={[componentState.value]}
      min={componentState.min}
      max={componentState.max}
      step={componentState.step}
      onValueChange={([val]) => component.setValue(val)}
      disabled={componentState.isDisabled}
      className={cn(cssClasses)}
      aria-valuenow={componentState.value}
      aria-valuemin={componentState.min}
      aria-valuemax={componentState.max}
      aria-disabled={componentState.isDisabled}
      aria-orientation="horizontal"
      {...dataAttributes}
    />
    {componentState.isDisabled && <p className="text-xs text-muted-foreground">Slider is disabled.</p>}
    {componentState.error && <p className="text-xs text-destructive">{String(componentState.error)}</p>}
  </div>
);


const accordionItemsExample = [
  { id: 'item-1', title: 'Is it accessible?', content: "Yes. It adheres to WAI-ARIA design patterns and the headless component manages aria attributes." },
  { id: 'item-2', title: 'Is it styled?', content: "Yes. This example uses ShadCN UI components for styling on top of the headless logic." },
  { id: 'item-3', title: 'Is it animated?', content: "Yes. ShadCN's Accordion comes with default animations." },
];

export const AccordionRenderer: InteractiveComponentWrapperProps<HeadlessAccordion, AccordionState>['renderComponent'] =
 (component, componentState, cssClasses, dataAttributes) => {
  const commonAccordionProps = {
    disabled: componentState.isDisabled,
    className: cn('w-full min-w-[300px] max-w-md p-2 rounded-md border', cssClasses),
    ...dataAttributes,
  };

  const accordionContentItems = accordionItemsExample.map((item) => (
    <ShadcnAccordionItem value={item.id} key={item.id} disabled={componentState.isDisabled}>
      <ShadcnAccordionTrigger
          onClick={(e) => {
            e.preventDefault();
            component.toggleItem(item.id);
          }}
          disabled={componentState.isDisabled} // Individual trigger can be disabled if item is or group is
          className={cn(componentState.openItems.includes(item.id) && "text-primary")}
      >
        {item.title}
      </ShadcnAccordionTrigger>
      <ShadcnAccordionContent className="bg-muted/30 p-3 rounded-b-md">{item.content}</ShadcnAccordionContent>
    </ShadcnAccordionItem>
  ));

  const errorAndDisabledMessages = (
    <>
      {componentState.isDisabled && <p className="text-xs text-muted-foreground mt-2 p-2">Accordion group is disabled.</p>}
      {componentState.error && <p className="text-xs text-destructive mt-2 p-2">{String(componentState.error)}</p>}
    </>
  );

  if (componentState.type === 'single') {
    return (
      <ShadcnAccordion
        type="single"
        collapsible={componentState.collapsible}
        value={componentState.openItems[0] || ""}
        {...commonAccordionProps}
      >
        {accordionContentItems}
        {errorAndDisabledMessages}
      </ShadcnAccordion>
    );
  } else { // type === 'multiple'
    return (
      <ShadcnAccordion
        type="multiple"
        value={componentState.openItems}
        {...commonAccordionProps}
      >
        {accordionContentItems}
        {errorAndDisabledMessages}
      </ShadcnAccordion>
    );
  }
};


const tabsItemsExample = [
  { id: 'account', title: 'Account', content: "Make changes to your account here. This content is dynamic based on the active tab." },
  { id: 'password', title: 'Password', content: "Change your password here. Ensure it's strong and unique." },
  { id: 'notifications', title: 'Notifications', content: "Manage your notification preferences for various events." },
  { id: 'support', title: 'Support', content: "Contact support for assistance." },
];

export const TabsRenderer: InteractiveComponentWrapperProps<HeadlessTabs, TabsState>['renderComponent'] =
 (component, componentState, cssClasses, dataAttributes) => (
  <ShadcnTabs
    value={componentState.activeTab ?? ""}
    onValueChange={(tabId) => component.activateTab(tabId)}
    orientation={componentState.orientation}
    className={cn('w-full min-w-[300px] max-w-lg p-2 rounded-md border', cssClasses)}
    {...dataAttributes}
  >
    <ShadcnTabsList
      className={cn(componentState.isDisabled && "opacity-60 cursor-not-allowed")}
    >
      {tabsItemsExample.map((tab) => (
        <ShadcnTabsTrigger
          key={tab.id}
          value={tab.id}
          disabled={componentState.isDisabled} // Individual tab disabled state could be managed via tab.disabled if needed
          className={cn(componentState.activeTab === tab.id && "font-semibold")}
        >
          {tab.title}
        </ShadcnTabsTrigger>
      ))}
    </ShadcnTabsList>
    {tabsItemsExample.map((tab) => (
      <ShadcnTabsContent key={tab.id} value={tab.id} className="p-4 mt-2 border-t border-border bg-card rounded-b-md shadow-inner">
        <p className="text-foreground/90">{tab.content}</p>
        {componentState.activeTab === tab.id && componentState.isLoading && (
          <div className="flex items-center space-x-2 mt-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading content...</span>
          </div>
        )}
      </ShadcnTabsContent>
    ))}
    {componentState.isDisabled && <p className="text-xs text-muted-foreground mt-2 p-1">Tabs group is disabled.</p>}
    {componentState.error && <p className="text-xs text-destructive mt-2 p-1">{String(componentState.error)}</p>}
  </ShadcnTabs>
);
