import { useState, useEffect, useMemo, useCallback } from 'react';
// Path alias imports are fine here, as tsc will resolve them correctly
// based on baseUrl and paths in tsconfig.json, and then make them
// relative in the dist output. The critical part is that the files
// being pointed to (e.g., index.ts and command.ts in headless-logic)
// have their *own* internal relative imports fixed.
import type { HeadlessComponent, BaseComponentState, CssState } from '@/components/headless-logic';
import type { CommandHistoryState } from '@/components/headless-logic/command';

interface HeadlessHookResult<T extends HeadlessComponent<S>, S extends BaseComponentState> {
  component: T;
  componentState: S;
  cssState: CssState;
  history: CommandHistoryState;
  undo: () => void;
  redo: () => void;
}

export function useHeadlessComponent<T extends HeadlessComponent<S>, S extends BaseComponentState>(
  HeadlessComponentClass: new () => T
): HeadlessHookResult<T, S> {
  const component = useMemo(() => new HeadlessComponentClass(), [HeadlessComponentClass]);

  const [componentState, setComponentState] = useState<S>(component.getState());
  const [cssState, setCssState] = useState<CssState>(component.getCSSState());
  const [history, setHistory] = useState<CommandHistoryState>(component.getHistory());

  useEffect(() => {
    const onStateChanged = (_event: string, newState: S) => {
      setComponentState(newState);
    };
    const onCssStateChanged = (_event: string, newCssState: CssState) => {
      setCssState(newCssState);
    };
    const onHistoryChanged = (_event: string, newHistory: CommandHistoryState) => {
      setHistory(newHistory);
    };

    const unsubscribeState = component.subscribe('stateChanged', onStateChanged as any);
    const unsubscribeCss = component.subscribe('cssStateChanged', onCssStateChanged as any);
    const unsubscribeTransition = component.subscribe('stateTransition', () => {
        setComponentState(component.getState());
        setCssState(component.getCSSState());
    });
    const unsubscribeHistory = component.subscribe('historyChanged', onHistoryChanged as any);
    
    // Initial sync
    setComponentState(component.getState());
    setCssState(component.getCSSState());
    setHistory(component.getHistory());

    return () => {
      unsubscribeState();
      unsubscribeCss();
      unsubscribeTransition();
      unsubscribeHistory();
    };
  }, [component]);

  const undo = useCallback(() => {
    component.undo();
  }, [component]);

  const redo = useCallback(() => {
    component.redo();
  }, [component]);

  return { component, componentState, cssState, history, undo, redo };
}
