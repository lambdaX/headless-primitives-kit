'use client';

import { HeadlessButton } from '@/components/headless-logic';
import { InteractiveComponentWrapper, ButtonRenderer } from './interactive-component-wrapper';

export function ButtonShowcase() {
  return (
    <section id="button-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Button Showcase</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InteractiveComponentWrapper
          componentType={HeadlessButton}
          renderComponent={ButtonRenderer}
          title="Default Button"
          description="A standard clickable button."
        />
        <InteractiveComponentWrapper
          componentType={HeadlessButton}
          renderComponent={ButtonRenderer}
          title="Disabled Button"
          description="This button is disabled."
          initialStateOverrides={{ isDisabled: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessButton}
          renderComponent={ButtonRenderer}
          title="Loading Button"
          description="This button shows a loading state."
          initialStateOverrides={{ isLoading: true }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessButton}
          renderComponent={ButtonRenderer}
          title="Error Button"
          description="This button indicates an error state."
          initialStateOverrides={{ error: 'Something went wrong!' }}
        />
      </div>
    </section>
  );
}
