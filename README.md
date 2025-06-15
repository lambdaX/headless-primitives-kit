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
*(Note: Replace `headless-primitives-kit` with the actual package name if you publish it under a different name.)*

## Basic Usage

Here's a basic example of how to use the `HeadlessButton` with a conceptual `useHeadlessComponent` hook (you might need to implement or adapt a similar hook for your React components to subscribe to state changes).

```tsx
import React, { useState, useEffect, useMemo } from 'react';
import { HeadlessButton, ButtonState, CssState } from 'headless-primitives-kit/headless-button';
// Or import all from root: import { HeadlessButton, ButtonState } from 'headless-primitives-kit';

// Conceptual hook (adapt or use one from your project if available)
function useHeadlessComponent<TLogic extends { getState: () => any; getCSSState: () => any; subscribe: (event: string, cb: any) => () => void; }, TState, TCssState>(
  ComponentLogicClass: new () => TLogic
) {
  const component = useMemo(() => new ComponentLogicClass(), [ComponentLogicClass]);
  const [componentState, setComponentState] = useState<TState>(component.getState());
  const [cssState, setCssState] = useState<TCssState>(component.getCSSState());

  useEffect(() => {
    const onStateChanged = (_event: string, newState: TState) => setComponentState(newState);
    const onCssStateChanged = (_event: string, newCssState: TCssState) => setCssState(newCssState);

    const unsubState = component.subscribe('stateChanged', onStateChanged);
    const unsubCss = component.subscribe('cssStateChanged', onCssStateChanged);
    const unsubTransition = component.subscribe('stateTransition', () => {
        setComponentState(component.getState());
        setCssState(component.getCSSState());
    });

    // Initial sync
    setComponentState(component.getState());
    setCssState(component.getCSSState());

    return () => {
      unsubState();
      unsubCss();
      unsubTransition();
    };
  }, [component]);

  return { component, componentState, cssState };
}


function MyStyledButton() {
  const { component, componentState, cssState } = useHeadlessComponent<HeadlessButton, ButtonState, CssState>(HeadlessButton);

  // Example event subscription
  useEffect(() => {
    const handleButtonClick = (event: string, data?: any) => {
      console.log('Button clicked!', data);
    };
    const unsubscribe = component.subscribe('clicked', handleButtonClick);
    return () => unsubscribe();
  }, [component]);

  return (
    <button
      type="button"
      onClick={(e) => component.click(e)}
      onMouseEnter={(e) => component.hover(true, e)}
      onMouseLeave={(e) => component.hover(false, e)}
      onFocus={(e) => component.focus(true, e)}
      onBlur={(e) => component.focus(false, e)}
      onKeyDown={(e) => component.keydown(e)}
      onMouseDown={() => component.press(true)}
      onMouseUp={() => component.press(false)}
      disabled={componentState.isDisabled || componentState.isLoading}
      aria-disabled={componentState.isDisabled || componentState.isLoading}
      className={`my-button-styles ${cssState.classes.join(' ')} ${componentState.isPressed ? 'pressed' : ''}`}
      {...cssState.dataAttributes} // Includes data-disabled, data-loading etc.
    >
      {componentState.isLoading ? 'Loading...' : 'Click Me'}
    </button>
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

And supporting utilities:
*   `CommandInvoker` for undo/redo.
*   `EventEmitter` for event handling.
*   Various `ComponentState` classes.
*   Various `InteractionStrategy` classes.

## Building the Library

To compile the TypeScript source in `src/components/headless-logic/` to JavaScript and generate declaration files in the `dist/` directory, run:

```bash
npm run build:logic
```

## Philosophy

This library provides the "brains" for your UI components without dictating their appearance or specific React structure.
You are responsible for:
1.  Rendering the UI (JSX).
2.  Styling the UI.
3.  Connecting the rendered UI elements' event handlers (like `onClick`, `onFocus`) to the methods provided by the headless component instances.
4.  Subscribing to state changes from the headless components to re-render your React components.

This gives you maximum flexibility and control over the final look, feel, and accessibility of your components.

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

This project is licensed under the MIT License (or your chosen license).
