'use client';

import { HeadlessCheckbox } from '@/components/headless-logic';
import { InteractiveComponentWrapper, CheckboxRenderer } from './interactive-component-wrapper';

export function CheckboxShowcase() {
  return (
    <section id="checkbox-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Checkbox Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Default Checkbox"
          description="A standard checkbox."
        />
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Initially Checked Checkbox"
          description="This checkbox starts checked."
          initialStateOverrides={{ isChecked: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Indeterminate Checkbox"
          description="This checkbox is in an indeterminate state."
          initialStateOverrides={{ isIndeterminate: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Disabled Checkbox"
          description="This checkbox is disabled."
          initialStateOverrides={{ isDisabled: true, isChecked: false }}
        />
         <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Disabled Checked Checkbox"
          description="A disabled checkbox that is checked."
          initialStateOverrides={{ isDisabled: true, isChecked: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessCheckbox}
          renderComponent={CheckboxRenderer}
          title="Checkbox with Error"
          description="A checkbox indicating an error."
          initialStateOverrides={{ error: "Selection conflict", isChecked: true }}
        />
      </div>
    </section>
  );
}
