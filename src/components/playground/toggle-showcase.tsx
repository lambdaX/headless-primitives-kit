'use client';

import { HeadlessToggle } from '@/components/headless-logic';
import { InteractiveComponentWrapper, ToggleRenderer } from './interactive-component-wrapper';

export function ToggleShowcase() {
  return (
    <section id="toggle-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Toggle Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InteractiveComponentWrapper
          componentType={HeadlessToggle}
          renderComponent={ToggleRenderer}
          title="Default Toggle"
          description="A standard toggle switch."
        />
        <InteractiveComponentWrapper
          componentType={HeadlessToggle}
          renderComponent={ToggleRenderer}
          title="Initially Checked Toggle"
          description="This toggle starts in the 'checked' state."
          initialStateOverrides={{ isChecked: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessToggle}
          renderComponent={ToggleRenderer}
          title="Disabled Toggle"
          description="This toggle is disabled and cannot be interacted with."
          initialStateOverrides={{ isDisabled: true, isChecked: false }}
        />
         <InteractiveComponentWrapper
          componentType={HeadlessToggle}
          renderComponent={ToggleRenderer}
          title="Loading Toggle"
          description="This toggle is in a loading state."
          initialStateOverrides={{ isLoading: true, isChecked: true }}
        />
      </div>
    </section>
  );
}
