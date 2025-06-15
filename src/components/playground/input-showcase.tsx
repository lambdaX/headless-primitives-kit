'use client';

import { HeadlessInput } from '@/components/headless-logic';
import { InteractiveComponentWrapper, InputRenderer } from './interactive-component-wrapper';

export function InputShowcase() {
  return (
    <section id="input-showcase" className="space-y-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight text-primary">Input Showcase</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <InteractiveComponentWrapper
          componentType={HeadlessInput}
          renderComponent={InputRenderer}
          title="Default Input"
          description="A standard text input field."
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
          description="This input is disabled."
          initialStateOverrides={{ isDisabled: true, value: "Can't edit me" }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessInput}
          renderComponent={InputRenderer}
          title="Read-only Input"
          description="This input is read-only."
          initialStateOverrides={{ isReadOnly: true, value: "Can't change me" }}
        />
        <InteractiveComponentWrapper
          componentType={HeadlessInput}
          renderComponent={InputRenderer}
          title="Input with Error"
          description="This input shows an error state."
          initialStateOverrides={{ error: 'Invalid input', value: "Oops!" }}
        />
      </div>
    </section>
  );
}
