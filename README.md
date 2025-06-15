
# Headless Primitives Kit

A lightweight, unstyled, and accessible set of headless UI component primitives for React, built with TypeScript. It provides robust state management, interaction handling, and an undo/redo system out of the box.

## Features

*   **Headless & Unstyled**: Full control over styling and rendering. You bring your own styles and JSX.
*   **State Management**: Built-in, predictable state handling for common UI interactions.
*   **Command Pattern**: Undo/redo functionality for component state changes is integrated.
*   **Event-Driven**: Subscribe to component events (e.g., `clicked`, `toggled`, `valueChanged`).
*   **TypeScript**: Strongly typed for a better developer experience and code quality.
*   **Modular**: Import only the primitives you need, thanks to ES module support and subpath exports.
*   **Interaction Strategies**: Decoupled logic for how components react to user inputs (click, hover, focus, keyboard).

## Installation

```bash
npm install headless-primitives-kit
# or
yarn add headless-primitives-kit
```
*(Note: Package name is `headless-primitives-kit` as per `package.json`.)*

## Basic Usage

Here's a basic example of how to use the `HeadlessButton` with the `useHeadlessComponent` hook provided by the library.

```tsx
import React from 'react';
// Import the specific headless component logic
import { HeadlessButton, ButtonState, CssState } from 'headless-primitives-kit/headless-button';
// Import the hook to manage the component instance and its state
import { useHeadlessComponent } from 'headless-primitives-kit/hooks/use-headless-component';
// Your utility for classnames, e.g., from ShadCN
import { cn } from '@/lib/utils'; 
// Example icons
import { Loader2 } from 'lucide-react'; 


function MyStyledButton({ label = "Click Me" }: { label?: string }) {
  const { 
    component,        // The instance of HeadlessButton
    componentState,   // The current data state of the button (e.g., { isDisabled, isLoading, ... })
    cssState,         // CSS classes and data-attributes (e.g., { classes: ['idle', ...], dataAttributes: {'data-disabled': 'false'} })
    history,          // Command history state (e.g., { canUndo, canRedo, length, currentPosition })
    undo,             // Function to undo the last state change
    redo              // Function to redo the last undone state change
  } = useHeadlessComponent<HeadlessButton, ButtonState>(HeadlessButton);

  // Example: Subscribe to the 'clicked' event from the headless component
  React.useEffect(() => {
    const handleButtonClick = (event: string, data?: any) => {
      console.log('Button clicked event via subscription!', data);
      // Perform actions when the button is clicked
    };
    const unsubscribe = component.subscribe('clicked', handleButtonClick);
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [component]);

  return (
    <div>
      <button
        type="button"
        onClick={(e) => component.click(e)} // Delegate click to headless component
        onMouseEnter={(e) => component.hover(true, e)}
        onMouseLeave={(e) => component.hover(false, e)}
        onFocus={(e) => component.focus(true, e)}
        onBlur={(e) => component.focus(false, e)}
        onKeyDown={(e) => component.keydown(e)} // For Space/Enter to trigger click
        onMouseDown={() => component.press(true)}
        onMouseUp={() => component.press(false)}
        disabled={componentState.isDisabled || componentState.isLoading}
        aria-disabled={componentState.isDisabled || componentState.isLoading}
        // Apply base headless classes and specific styling
        className={cn(
          "inline-flex items-center justify-center px-4 py-2 rounded-md shadow font-semibold",
          "transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2",
          // Example styling based on componentState
          componentState.isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : componentState.isLoading ? "bg-blue-300 text-blue-700 cursor-wait"
            : componentState.isPressed ? "bg-blue-700 text-white ring-blue-500"
            : componentState.isFocused ? "ring-blue-500 bg-blue-600 text-white"
            : componentState.isHovered ? "bg-blue-500 text-white"
            : "bg-blue-600 text-white",
          // Base classes from cssState (e.g., 'headless-component', 'button', 'idle')
          cssState.classes.join(' ') 
        )}
        // Data attributes from cssState (e.g., data-disabled, data-loading) for CSS or query selectors
        {...cssState.dataAttributes} 
      >
        {componentState.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {componentState.isLoading ? 'Processing...' : label}
      </button>

      {/* Example Undo/Redo controls */}
      <div style={{ marginTop: '10px' }}>
        <button onClick={undo} disabled={!history.canUndo} style={{ marginRight: '5px' }}>Undo</button>
        <button onClick={redo} disabled={!history.canRedo}>Redo</button>
        <span style={{ marginLeft: '10px', fontSize: '0.8em' }}>History: {history.currentPosition + 1}/{history.length}</span>
      </div>
    </div>
  );
}

export default MyStyledButton;
```

## Available Primitives

*   `HeadlessAccordion`
*   `HeadlessButton`
*   `HeadlessCheckbox`
*   `HeadlessComponent` (Base class)
*   `HeadlessInput`
*   `HeadlessRadioGroup`
*   `HeadlessSlider`
*   `HeadlessTabs`
*   `HeadlessToggle`

And supporting utilities/hooks:
*   `useHeadlessComponent` hook.
*   `CommandInvoker` for undo/redo.
*   `EventEmitter` for event handling.
*   Various `ComponentState` classes.
*   Various `InteractionStrategy` classes.

## Building the Library

To compile the TypeScript source in `src/components/headless-logic/` and `src/hooks/` to JavaScript and generate declaration files in the `dist/` directory, run:

```bash
npm run build:logic
```

This command uses `tsc` with the `tsconfig.build.json` configuration. The output `dist` folder is structured to be published.

## Philosophy

This library provides the "brains" for your UI components without dictating their appearance or specific React structure.
You are responsible for:
1.  Rendering the UI (JSX).
2.  Styling the UI.
3.  Connecting the rendered UI elements' event handlers (like `onClick`, `onFocus`) to the methods provided by the headless component instances.
4.  Subscribing to state changes from the headless components (or using the `useHeadlessComponent` hook which handles subscriptions) to re-render your React components.

This gives you maximum flexibility and control over the final look, feel, and accessibility of your components.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License (or your chosen license).
