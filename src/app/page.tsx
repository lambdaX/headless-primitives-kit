
import { ButtonShowcase } from "@/components/playground/button-showcase";
import { CheckboxShowcase } from "@/components/playground/checkbox-showcase";
import { InputShowcase } from "@/components/playground/input-showcase";
import { ToggleShowcase } from "@/components/playground/toggle-showcase";
import { RadioGroupShowcase } from "@/components/playground/radio-group-showcase";
import { SliderShowcase } from "@/components/playground/slider-showcase";
import { AccordionShowcase } from "@/components/playground/accordion-showcase";
import { TabsShowcase } from "@/components/playground/tabs-showcase";
import { Separator } from "@/components/ui/separator";


export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold font-headline tracking-tight text-primary sm:text-6xl md:text-7xl">
          Headless UI Playground
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80 sm:text-xl">
          Explore and interact with headless UI components. Modify their state via controls, observe changes in the inspector, use undo/redo, and see React usage examples.
        </p>
      </header>

      <div className="space-y-20">
        <ToggleShowcase />
        <Separator className="my-12" />
        <ButtonShowcase />
        <Separator className="my-12" />
        <InputShowcase />
        <Separator className="my-12" />
        <CheckboxShowcase />
        <Separator className="my-12" />
        <RadioGroupShowcase />
        <Separator className="my-12" />
        <SliderShowcase />
        <Separator className="my-12" />
        <AccordionShowcase />
        <Separator className="my-12" />
        <TabsShowcase />
      </div>

      <footer className="mt-20 pt-10 border-t text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Headless Primitives Kit Playground. Built with Next.js, ShadCN UI, and Tailwind CSS.</p>
      </footer>
    </main>
  );
}

    