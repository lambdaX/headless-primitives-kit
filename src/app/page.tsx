import { ButtonShowcase } from "@/components/playground/button-showcase";
import { CheckboxShowcase } from "@/components/playground/checkbox-showcase";
import { InputShowcase } from "@/components/playground/input-showcase";
import { ToggleShowcase } from "@/components/playground/toggle-showcase";
import { Separator } from "@/components/ui/separator";


export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold font-headline tracking-tight text-primary sm:text-6xl md:text-7xl">
          Headless UI Playground
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/80 sm:text-xl">
          Explore and interact with headless UI components. Modify their state, observe changes, and use undo/redo functionality.
        </p>
      </header>

      <div className="space-y-16">
        <ToggleShowcase />
        <Separator className="my-12" />
        <ButtonShowcase />
        <Separator className="my-12" />
        <InputShowcase />
        <Separator className="my-12" />
        <CheckboxShowcase />
      </div>

      <footer className="mt-16 pt-8 border-t text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Headless UI Playground. Built with Next.js and Tailwind CSS.</p>
      </footer>
    </main>
  );
}
